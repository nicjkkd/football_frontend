import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Bounce, toast } from "react-toastify";

export type WebSocketEvent = {
  operation: "invalidate" | "create" | "delete" | "update";
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
        const messageData: WebSocketEvent = JSON.parse(event.data);

        //___
        if (messageData.type)
          toast.success(`${messageData.type} Successfully `, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        //___
        switch (messageData.operation) {
          case "invalidate":
            queryClient.invalidateQueries(
              [...messageData.entity, messageData.id].filter(Boolean)
            );
            break;

          case "create":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              if (!Array.isArray(oldData)) return [messageData.data];
              return [...oldData, messageData.data];
            });
            break;

          case "update":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              const update = (entity: Record<string, unknown>) =>
                entity.id === messageData.id
                  ? { ...entity, ...messageData.data }
                  : entity;

              return Array.isArray(oldData)
                ? oldData.map(update)
                : update(oldData as Record<string, unknown>);
            });
            break;

          case "delete":
            queryClient.setQueriesData(messageData.entity, (oldData) => {
              if (!Array.isArray(oldData)) return oldData;
              return oldData.filter((item) => item.id !== messageData.id);
            });
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
