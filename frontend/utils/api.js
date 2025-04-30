import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchTopStories = async (lang = 'en') => {
  try {
    const response = await api.get('/api/articles/top-stories', { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
};

export const fetchHealthTopics = async (lang = 'en') => {
  try {
    const response = await api.get('/api/articles/health-topics', { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching health topics:', error);
    return [];
  }
};

export const fetchArticle = async (slug, lang = 'en') => {
  try {
    const response = await api.get(`/api/articles/${slug}`, { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

export const fetchConditions = async () => {
  try {
    const response = await api.get('/api/conditions/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
};

export const fetchCondition = async (slug) => {
  try {
    const response = await api.get(`/api/conditions/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching condition:', error);
    return null;
  }
};

export const searchContent = async (query) => {
  try {
    const response = await api.get(`/api/search`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    return { articles: [], conditions: [], drugs: [] };
  }
};