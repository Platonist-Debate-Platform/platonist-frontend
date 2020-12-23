import { useEffect, useState } from "react";
import { Comment } from "../../../Library";
import { SocketKeys, SocketMethod } from "./Keys"
import { useSocket } from "./useSocket"

export const useCommentSocket = (): Comment | undefined => {
  const [create, createTime] = useSocket<Comment>({
    key: SocketKeys.Comment,
    method: SocketMethod.Create
  });

  const [update, updateTime] = useSocket<Comment>({
    key: SocketKeys.Comment,
    method: SocketMethod.Update
  });

  const [data, setData] = useState(create || update);

  useEffect(() => {
    if (createTime > updateTime && (create?.updated_at !== data?.updated_at)) {
      setData(create);
    }
    if (updateTime > createTime && (update?.updated_at !== data?.updated_at)) {
      setData(update)
    }
  }, [create, createTime, data?.updated_at, update, updateTime]);

  return data;
}