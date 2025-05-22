import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8001';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Unified base'http://0.0.0.0:8001',
  paramsSerializer: {
    encode: (param) => encodeURIComponent(param)
  },
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add language interceptor with isServer check
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('language') || 'en';
    config.params = { ...config.params, lang };
  }
  return config;
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);
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
    return response.data && response.data.length > 0 ? response.data : fallbackHealthTopics;
  } catch (error) {
    console.error('Error fetching health topics:', error);
    return fallbackHealthTopics;
  }
};

const fallbackHealthTopics = [
  {
    id: 5,
    title: 'Sleep Hygiene: Tips for Better Rest',
    slug: 'sleep-hygiene-tips',
    summary: 'Simple changes to improve your sleep quality and overall health.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    category: { name: 'Wellness' }
  },
  {
    id: 6,
    title: 'Exercise for Beginners: Starting a Sustainable Routine',
    slug: 'exercise-for-beginners',
    summary: 'How to build an exercise habit that lasts without getting overwhelmed.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    category: { name: 'Fitness' }
  },
  {
    id: 7,
    title: 'Stress Management Techniques That Actually Work',
    slug: 'stress-management-techniques',
    summary: 'Practical approaches to reduce stress and improve your mental wellbeing.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    category: { name: 'Mental Health' }
  }
];

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

// Latest news
export const fetchLatestNews = async () => {
  try {
    const response = await api.get('/api/news/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error.message || error);
    throw error;  // Ensure you propagate the error if needed
  }
};

export const fetchNewsArticle = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/api/news/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news article:', error);
    throw error;
  }
};

// Drugs index (A-Z)
export const fetchDrugsIndex = async () => {
  try {
    const response = await api.get('/api/drugs/index');
    const data = response.data;
    return data.map(drug => ({
      id: drug.id,
      title: drug.title,
      meta: drug.meta,
      generic_name: drug.generic_name,
      brand_names: drug.brand_names,
      drug_class: drug_class
    }));
  } catch (error) {
    console.error('Error fetching drugs index:', error);
    throw error;
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
  if (!query || query.trim().length === 0) {
    return { articles: [], conditions: [], drugs: [] };
  }

  try {
    const response = await api.get(`/api/search/`, {
      params: {
        q: query.trim(),
        lang: typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
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

// Add your API endpoints here
export const getDrugs = async () => {
  try {
    const response = await axios.get('/api/drugs/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching drugs:', error);
    throw error;
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