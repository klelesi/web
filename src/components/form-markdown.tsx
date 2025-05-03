import Shimmer from "./shimmer";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UnsafeHTML } from "@/components/unsafe-html";
import useClientAxios from "@/hooks/useClientAxios";
import { Card } from "@/components/card";
import { MarkdownPost } from "@/interfaces";
import { useDebounce } from "@uidotdev/usehooks";

export default function FormMarkdown({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  rows,
  showPreview = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (prop: string, value: string | number) => void;
  error?: string;
  disabled: boolean;
  rows?: number;
  showPreview?: boolean;
}) {
  const previewHtml = useRef("");
  const client = useClientAxios();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 1500);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      return;
    }

    setIsLoading(true);

    client
      .post(`/markdown`, { markdown: debouncedSearchTerm })
      .then((response) => response.data.data as MarkdownPost)
      .then((res: MarkdownPost) => {
        setIsLoading(false);
        previewHtml.current = res.html;
      });
  }, [debouncedSearchTerm, client]);

  const onFormInputChange = (event: ChangeEvent) => {
    // @ts-expect-error: wrong type for target
    onChange(name, event.target.value);
    event.preventDefault();
  };

  return (
    <div>
      <label>
        <span className="block text-sm leading-normal tracking-wide text-normal mb-1">{label}</span>
        {
          <textarea
            className={"w-full block border p-2 " + (error ? " text-error border-error bg-error-washed" : " text-black border-black ")}
            rows={rows ?? 18}
            disabled={disabled}
            value={value}
            onChange={onFormInputChange}
            placeholder={""}
          />
        }
      </label>

      <p className="text-error mt-2">{error}</p>

      {showPreview && <Preview isLoading={isLoading} previewHtml={previewHtml.current} />}
    </div>
  );
}

const Preview = ({ isLoading, previewHtml }: { isLoading: boolean; previewHtml?: string }) => {
  return (
    <>
      {isLoading ? (
        <Shimmer height={"5rem"} />
      ) : previewHtml && previewHtml.length > 0 ? (
        <>
          <h3 className="text-lg font-bold mb-2 mt-3">Predogled</h3>
          <Card>
            <UnsafeHTML html={previewHtml} />
          </Card>
        </>
      ) : null}
    </>
  );
};
