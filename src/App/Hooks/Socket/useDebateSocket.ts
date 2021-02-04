import { useEffect, useState } from 'react';
import { Debate } from '../../../Library';
import { SocketKeys, SocketMethod } from './Keys';
import { useSocket } from './useSocket';

export const useDebateSocket = (): Debate | undefined => {
  const [create, createTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Create,
  });

  const [update, updateTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Update,
  });

  const [remove, removeTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Delete,
  });

  const [data, setData] = useState(create || update);

  useEffect(() => {
    if (createTime > updateTime && create?.updated_at !== data?.updated_at) {
      setData(create);
    }
    if (updateTime > createTime && update?.updated_at !== data?.updated_at) {
      setData(update);
    }
    if (removeTime > createTime && remove?.updated_at !== data?.updated_at) {
      setData(remove);
    }
  }, [
    create,
    createTime,
    data?.updated_at,
    remove,
    removeTime,
    update,
    updateTime,
  ]);

  return data;
};
