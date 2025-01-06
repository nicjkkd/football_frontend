import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Bounce, toast } from "react-toastify";

export type WebSocketEvent = {
  operation: "invalidate";
  entity: Array<string>;
  id?: number;
  type?: string;
  data?: Record<string, string>;
};

export const useReactQuerySubscription = () => {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.addEventListener("open", () => {
      console.log("Created connection");
    });

    ws.current.addEventListener("message", (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        //___
        if (data.type)
          toast.success(
            `${data.type} Successfully ` + JSON.stringify(data.data),
            {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
        console.log(data);
        //___
        switch (data.operation) {
          case "invalidate":
            queryClient.invalidateQueries(
              [...data.entity, data.id].filter(Boolean)
            );
            console.log("invalidated");
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      ws.current?.close();
      console.log("Connection closed");
    };
  }, [queryClient]);
};

// крім операцій invalidate буде replace, add, remove та зробити додавання або видалення або реплейс не через invalidateQueries, а шляхом додавання, видалення, оновлення гравців з існуючого масиву
// teams як ліги зробити

// кожний інвент, який створюється має мати унікальний id
