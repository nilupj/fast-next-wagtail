
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { fetchArticle, fetchArticlePaths } from '../../../utils/api';

export const config = {
  amp: true,
};

export default function AmpArticle({ article }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NextSeo
        title={`${article.title} - HealthInfo`}
        description={article.excerpt}
        canonical={`https://healthinfo.com/articles/${article.slug}`}
      />
      
      <article className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-4">{article.title}</h1>
        
        {article.image && (
          <amp-img
            src={article.image.url}
            width={800}
            height={400}
            layout="responsive"
            alt={article.title}
          />
        )}
        
        <div className="mt-6 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await fetchArticlePaths();
  return {
    paths: paths.map(slug => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const article = await fetchArticle(params.slug);
  
  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article },
    revalidate: 3600,
  };
}
