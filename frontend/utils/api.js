import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const locale = typeof window !== 'undefined' ? window.localStorage.getItem('locale') || 'en' : 'en';
  config.params = { ...config.params, lang: locale };
  return config;
});

// Add language interceptor with isServer check
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('language') || 'en';
    config.params = { ...config.params, lang };
  }
  return config;
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
export const fetchCondition = async (slug, lang = 'en') => {
  try {
    const path = lang === 'hi' ? `/api/conditions/hi/${slug}` : `/api/conditions/${slug}`;
    const response = await api.get(path, {
      params: { lang }
    });
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
export const fetchArticle = async (slug, lang) => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const currentLang = lang || (typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en');
    const response = await api.get(`/api/articles/${encodedSlug}`, {
      params: { lang: currentLang }
    });
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
    const response = await fetch(`${API_URL}/drugs/index/`);
    if (!response.ok) throw new Error('Failed to fetch drugs index');
    const data = await response.json();
    return data.map(drug => ({
      name: drug.title || drug.name,
      slug: drug.slug,
      type: drug.drug_class
    }));
  } catch (error) {
    console.error('Error fetching drugs index:', error);
    return [];
  }
};

// Fetch drug details
export const fetchDrugDetails = async (slug) => {
  try {
    const response = await api.get(`/api/drugs/${slug}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drug details:', error);
    throw error;
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
    const response = await api.post('/api/symptom-checker/', data);
    return response.data;
  } catch (error) {
    console.error('Error checking symptoms:', error);
    throw error;
  }
};

export default api;
export async function searchDrugs(query) {
  try {
    const response = await fetch(`${CMS_API_URL}/drugs/search/?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching drugs:', error);
    return [];
  }
}

export const getDrugBySlug = async (slug) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/drugs/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching drug:", error);
    throw new Error(error.response?.data?.detail || "Failed to fetch drug information");
  }
};