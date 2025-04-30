import Shimmer from "./shimmer";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UnsafeHTML } from "@/components/unsafe-html";
import useClientAxios from "@/hooks/useClientAxios";
import { Card } from "@/components/card";
import { MarkdownPost } from "@/interfaces";
import { useDebounce } from "@uidotdev/usehooks";

export default function FormMarkdown(props: {
  label: string;
  name: string;
  value: string;
  onChange: (prop: string, value: string | number) => void;
  error?: string;
  autocomplete?: string;
  disabled: boolean;
  rows?: number;
}) {
  const previewHtml = useRef("");
  const client = useClientAxios();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(props.value, 1500);

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
    props.onChange(props.name, event.target.value);
    event.preventDefault();
  };

  return (
    <div>
      <label>
        <span className="block text-sm leading-normal tracking-wide text-normal mb-1">{props.label}</span>
        {
          <textarea
            className={"w-full block border p-2 " + (props.error ? " text-error border-error bg-error-washed" : " text-black border-black ")}
            rows={props.rows ?? 18}
            disabled={props.disabled}
            value={props.value}
            onChange={onFormInputChange}
            placeholder={""}
          />
        }
      </label>

      <p className="text-error mt-2">{props.error}</p>

      {isLoading ? (
        <Shimmer height={"5rem"} />
      ) : previewHtml.current.length > 0 ? (
        <>
          <h3 className="text-lg font-bold mb-2 mt-3">Predogled</h3>
          <Card>
            <div className="prose">
              <UnsafeHTML html={previewHtml.current} />
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
