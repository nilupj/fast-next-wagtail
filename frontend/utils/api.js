import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Top stories
export const fetchTopStories = async () => {
  try {
    const response = await api.get('/api/articles/top-stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
};

// Health topics
export const fetchHealthTopics = async () => {
  try {
    const response = await api.get('/api/articles/health-topics');
    return response.data;
  } catch (error) {
    console.error('Error fetching health topics:', error);
    return [];
  }
};

// Conditions index (A-Z)
export const fetchConditionsIndex = async () => {
  try {
    const response = await api.get('/api/conditions/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching conditions index:', error);
    return [];
  }
};

// Condition paths for static generation
export const fetchConditionPaths = async () => {
  try {
    const response = await api.get('/api/conditions/paths');
    return response.data;
  } catch (error) {
    console.error('Error fetching condition paths:', error);
    return [];
  }
};

// Single condition details
export const fetchCondition = async (slug) => {
  try {
    const response = await api.get(`/api/conditions/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching condition ${slug}:`, error);
    return null;
  }
};

// Article paths for static generation
export const fetchArticlePaths = async () => {
  try {
    const response = await api.get('/api/articles/paths');
    return response.data;
  } catch (error) {
    console.error('Error fetching article paths:', error);
    return [];
  }
};

// Single article details
export const fetchArticle = async (slug) => {
  try {
    const response = await api.get(`/api/articles/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
};

// Related articles
export const fetchRelatedArticles = async (slug) => {
  try {
    const response = await api.get(`/api/articles/${slug}/related`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching related articles for ${slug}:`, error);
    return [];
  }
};

// Drugs index (A-Z)
export const fetchDrugsIndex = async () => {
  try {
    const response = await api.get('/api/drugs/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching drugs index:', error);
    return [];
  }
};

// Well-being articles
export const fetchWellBeingArticles = async () => {
  try {
    const response = await api.get('/api/well-being');
    return response.data;
  } catch (error) {
    console.error('Error fetching well-being articles:', error);
    return { featured: [], articles: [] };
  }
};

// Search
export const searchContent = async (query) => {
  try {
    const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    return { articles: [], conditions: [], drugs: [] };
  }
};

// Symptom checker
export const checkSymptoms = async (data) => {
  try {
    const response = await api.post('/api/symptom-checker', data);
    return response.data;
  } catch (error) {
    console.error('Error checking symptoms:', error);
    throw error;
  }
};

export default api;
