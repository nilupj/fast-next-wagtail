import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import ArticleCard from '../../components/ArticleCard';
import { fetchArticle, fetchArticlePaths, fetchRelatedArticles } from '../../utils/api';
import ContentNav from '../../components/ContentNav'; // Added import statement

export default function ArticleDetail({ article, relatedArticles }) {
  const router = useRouter();

  // If fallback is true and the page is being generated
  if (router.isFallback) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-neutral-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Article Not Found</h1>
        <p className="text-neutral-600 mb-6">The article you are looking for does not exist or has been moved.</p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  const {
    title,
    subtitle,
    image,
    author,
    first_published_at: published_date,
    last_published_at: updated_date,
    body,
    tags = [],
    category = '',
  } = article || {};

  const content = body || article?.content;

  // Format dates
  const formattedPublishedDate = new Date(published_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedUpdatedDate = updated_date 
    ? new Date(updated_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <NextSeo
        title={`${title} - HealthInfo`}
        description={subtitle || `Read about ${title} on HealthInfo.`}
        canonical={`https://healthinfo.com/articles/${router.query.slug}`}
        openGraph={{
          title: title,
          description: subtitle,
          images: image ? [{ url: image }] : [],
          type: 'article',
          article: {
            publishedTime: published_date,
            modifiedTime: updated_date,
            authors: [author?.name],
            tags: tags,
          },
        }}
      />

      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            {category && (
              <li className="flex items-center">
                <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">
                  {category.name}
                </Link>
                <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
            )}
            <li>
              <span className="text-neutral-600">{title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <header className="p-6 pb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">{title}</h1>
                {subtitle && <p className="text-xl text-neutral-600 mb-4">{subtitle}</p>}

                <div className="flex flex-wrap items-center text-sm text-neutral-500 mb-6">
                  {author && (
                    <div className="flex items-center mr-6 mb-2">
                      <span className="font-medium">By {author.name}</span>
                      {author.credentials && <span>, {author.credentials}</span>}
                    </div>
                  )}
                  <div className="mr-6 mb-2">
                    <time dateTime={published_date}>Published: {formattedPublishedDate}</time>
                  </div>
                  {formattedUpdatedDate && (
                    <div className="mb-2">
                      <time dateTime={updated_date}>Updated: {formattedUpdatedDate}</time>
                    </div>
                  )}
                </div>
              </header>

              {image && (
                <div className="relative h-64 sm:h-80 md:h-96 w-full">
                  <Image 
                    src={image} 
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="prose max-w-none">
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <p>Content not available</p>
                  )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-neutral-200">
                    <h3 className="text-lg font-semibold mb-2">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Link
                          key={tag}
                          href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                          className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm hover:bg-neutral-200 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author bio */}
                {author && author.bio && (
                  <div className="mt-8 pt-6 border-t border-neutral-200">
                    <div className="flex items-start">
                      {author.image && (
                        <div className="flex-shrink-0 mr-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image 
                              src={author.image} 
                              alt={author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">About the Author</h3>
                        <p className="text-sm font-medium">{author.name}{author.credentials && `, ${author.credentials}`}</p>
                        <p className="text-sm text-neutral-600 mt-1">{author.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical disclaimer */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-sm">
                    <strong>Medical Disclaimer:</strong> The information provided in this article is for educational and 
                    informational purposes only and should not be considered medical advice. Always consult with a 
                    qualified healthcare provider for personalized medical advice.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div>
            {/* Related articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map(article => (
                    <div key={article.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium mb-1">
                        <Link 
                          href={`/articles/${article.slug}`}
                          className="text-primary hover:text-primary-light transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-neutral-600 line-clamp-2">{article.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular topics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Popular Topics</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/conditions/diabetes"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Diabetes
                </Link>
                <Link 
                  href="/conditions/heart-disease"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Heart Disease
                </Link>
                <Link 
                  href="/conditions/hypertension"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Hypertension
                </Link>
                <Link 
                  href="/conditions/arthritis"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Arthritis
                </Link>
                <Link 
                  href="/conditions/covid-19"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  COVID-19
                </Link>
                <Link 
                  href="/conditions/cancer"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Cancer
                </Link>
                <Link 
                  href="/conditions/anxiety"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Anxiety
                </Link>
                <Link 
                  href="/conditions/depression"
                  className="p-2 bg-neutral-50 rounded text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
                >
                  Depression
                </Link>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="bg-primary-light rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
              <p className="mb-4 text-white/90">
                Get the latest health news and information delivered straight to your inbox.
              </p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-3 py-2 text-neutral-800 text-sm rounded border-0 focus:ring-2 focus:ring-white"
                  required 
                />
                <button 
                  type="submit" 
                  className="w-full py-2 px-4 bg-white text-primary text-sm font-medium rounded hover:bg-neutral-100 transition-colors"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* More from HealthInfo */}
        <div className="mt-12">
          <h2 className="section-title">More From HealthInfo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArticleCard 
              article={{
                id: 1,
                title: 'The Key Health Benefits of Pistachios',
                slug: 'health-benefits-pistachios',
                image: 'https://example.com/images/pistachios.jpg',
                summary: 'Discover how these small nuts pack a powerful nutritional punch and contribute to overall health.',
                category: 'Nutrition',
                created_at: '2023-03-15T14:00:00Z',
              }}
            />
            <ArticleCard 
              article={{
                id: 2,
                title: 'How Alcohol Affects Your Skin',
                slug: 'alcohol-affects-skin',
                image: 'https://example.com/images/alcohol-skin.jpg',
                summary: 'Learn about the impact of alcohol consumption on your skin health and appearance.',
                category: 'Skincare',
                created_at: '2023-03-10T10:30:00Z',
              }}
            />
            <ArticleCard 
              article={{
                id: 3,
                title: 'What Causes Cracked Heels?',
                slug: 'causes-cracked-heels',
                image: 'https://example.com/images/cracked-heels.jpg',
                summary: 'Understanding the causes, prevention, and treatment options for cracked heels.',
                category: 'Foot Health',
                created_at: '2023-03-05T08:15:00Z',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const paths = await fetchArticlePaths();

    return {
      paths: paths.map(slug => ({ params: { slug } })),
      fallback: true, // Show a loading state while generating pages on-demand
    };
  } catch (error) {
    console.error('Error fetching article paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params, locale }) {
  try {
    const article = await fetchArticle(params.slug, locale);

    if (!article) {
      return {
        notFound: true,
      };
    }

    // Fetch related articles (consider passing lang here too if related articles are language-dependent)
    const relatedArticles = await fetchRelatedArticles(params.slug);

    return {
      props: {
        article,
        relatedArticles,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error(`Error fetching article ${params.slug}:`, error);
    return {
      notFound: true,
    };
  }
}