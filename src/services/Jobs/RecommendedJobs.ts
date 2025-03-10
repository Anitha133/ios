import axios from 'axios';
import { JobData } from '@models/Model';
import {API_BASE_URL} from '@env';


const API_URLS = {
  recommendedJobs: (userId: number |null, page: number = 0, size: number = 300) =>
    `${API_BASE_URL}/recommendedjob/findrecommendedjob/${userId}?page=${page}&size=${size}`,
  jobDetails: (jobId: number, userId: number|null) =>
    `${API_BASE_URL}/viewjob/applicant/viewjob/${jobId}/${userId}`,
};

export const fetchRecommendedJobs = async (userId: number| null, userToken: string|null): Promise<JobData[]> => {
  const response = await axios.get(API_URLS.recommendedJobs(userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return response.data;
};

export const fetchJobDetails = async (
  jobId: number,
  userId: number| null,
  userToken: string |null
): Promise<JobData> => {
  const response = await axios.get(API_URLS.jobDetails(jobId, userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return response.data.body;
};