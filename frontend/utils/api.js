import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Wagtail API endpoints
export const fetchWagtailPages = async (type) => {
  try {
    const response = await api.get(`/api/v2/pages/?type=${type}`);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching Wagtail pages:', error);
    return [];
  }
};

export const fetchWagtailArticles = async () => {
  return fetchWagtailPages('articles.ArticlePage');
};

export const fetchWagtailConditions = async () => {
  return fetchWagtailPages('conditions.ConditionPage');
};

export const fetchWagtailDrugs = async () => {
  return fetchWagtailPages('drugs.DrugPage');
};

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
    const response = await api.get(`/api/v2/pages/?type=articles.ArticlePage&fields=*&slug=${slug}&locale=${lang}`);
    if (response.data.items && response.data.items.length > 0) {
      const article = response.data.items[0];
      return {
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        summary: article.summary,
        content: article.body || article.content,
        image: article.image?.meta?.download_url || article.image,
        author: article.author,
        category: article.category?.name || article.category || '',
        tags: article.tags || [],
        first_published_at: article.first_published_at,
        last_published_at: article.last_published_at
      };
    }
    return null;
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