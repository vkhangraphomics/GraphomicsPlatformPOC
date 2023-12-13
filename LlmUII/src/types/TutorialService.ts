import http from "../http-common";
import ITutorialData from "../types/Tutorial";

const getAll = () => {
  return http.get<Array<ITutorialData>>("/tutorials");
};

const execute = () => {
  return http.post<Array<ITutorialData>>("/execute");
};

const get = (id: any) => {
  return http.get<ITutorialData>(`/tutorials/${id}`);
};

const create = (data: ITutorialData) => {
  return http.post<ITutorialData>("/tutorials", data);
};

const update = (id: any, data: ITutorialData) => {
  return http.put<any>(`/tutorials/${id}`, data);
};

const csv = (data: any) => {
  return http.put<any>(`/upload-csv`, data);
};
const remove = (id: any) => {
  return http.delete<any>(`/tutorials/${id}`);
};

const removeAll = () => {
  return http.delete<any>(`/tutorials`);
};

const findByTitle = (title: string) => {
  return http.get<Array<ITutorialData>>(`/tutorials?title=${title}`);
};

const TutorialService = {
  getAll,
  get,
  create,
  update,
  execute,
  remove,
  removeAll,
  findByTitle,
};

export default TutorialService;
