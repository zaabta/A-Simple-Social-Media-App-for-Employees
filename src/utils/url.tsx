import { UsersUrlParams } from "@/types";
import { PAGE_PATH } from "@/constants";

export function buildUsersUrl(params: UsersUrlParams, page: PAGE_PATH): string {
  const query = new URLSearchParams();
 
  query.set('page', String(params.page));
  if (params.query)        query.set('search',        params.query);
  if (params.sortFirstName) query.set('sortFirstName', params.sortFirstName);
  if (params.sortAge)       query.set('sortAge',       params.sortAge);
  if (params.filters.city)          query.set('city',          params.filters.city);
  if (params.filters.job)           query.set('job',           params.filters.job);
  if (params.filters.gender)        query.set('gender',        params.filters.gender);
 
  return `${page}?${query.toString()}`;
}