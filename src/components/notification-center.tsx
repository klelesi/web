import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons/faBell";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import useUserApi from "@/hooks/useUserApi";
import { Notification } from "@/interfaces";
import { useRouter } from "next/navigation";

export default function NotificationCenter() {
  const { currentUser } = useContext(AuthContext);
  const { getNotifications, readNotification } = useUserApi();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      getNotifications().then((response) => {
        setNotifications(response.data.data);
      });
    }
  }, [getNotifications, currentUser]);

  function readNotificationCb(id: string) {
    readNotification(id).then(() => {});
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }

  function navigateToTarget(notification: Notification) {
    readNotification(notification.id).then(() => {
      router.push(`${notification.post.slug}?target=${notification.target.id}`, {});
      setOpen(false);
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    });
  }

  return (
    <>
      <div className="relative">
        <button title={"Obvestila"} className={"btn btn-sm btn-link relative"} onClick={() => setOpen((prev) => !prev)}>
          <FontAwesomeIcon icon={faBell} />
          {notifications.length > 0 && (
            <div className="border leading-5 border-red-dark border-2 absolute top-0 right-0 bg-red w-5 h-5 rounded-full text-white -mt-2 -mr-2 text-sm">
                        <span className="relative" style={{ top: "-2px" }}>
                          {notifications.length}
                        </span>
            </div>
          )}
        </button>

        {open && (
          <div className="absolute w-[250px] right-0 -mr-24 border rounded-sm  top-10  z-10 bg-white shadow p-3">
            {notifications.length === 0 && <p className="text-center text-dark-gray italic text-sm">Nimaš obvestil</p>}

            {notifications.map((notification) => {
              return (
                <div className={"text-sm flex flex-row items-center"} key={notification.id}>
                  <div className="flex-1">
                    <button title={'Poglej obvestilo'} className="btn btn-sm btn-link w-full text-left" onClick={() => navigateToTarget(notification)}>
                      <FontAwesomeIcon icon={faEye} className={"mr-2"} />
                      Nov komentar!
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-link"
                      title={"Odstrani obvestilo"}
                      onClick={() => readNotificationCb(notification.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  )
}