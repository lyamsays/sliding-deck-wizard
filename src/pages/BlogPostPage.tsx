import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { posts, getPostBySlug } from '@/data/posts';

const renderContent = (content: string) => {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.includes('—')) {
      // Bold lead-in with dash (definition style)
      const text = line.replace(/\*\*/g, '');
      const boldPart = text.split('—')[0].trim();
      const rest = '—' + text.split('—').slice(1).join('—');
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed mb-4">
          <strong>{boldPart}</strong>{rest}
        </p>
      );
    } else if (line.startsWith('- ')) {
      // Collect list items
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().replace(/^- /, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 mb-6 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      );
      continue;
    } else {
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed mb-5 text-lg"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      );
    }
    i++;
  }
  return elements;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) navigate('/blog', { replace: true });
  }, [post, navigate]);

  if (!post) return null;

  const currentIndex = posts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-10 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              LO
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Lyam Ouattara</div>
              <div className="text-xs text-gray-400">{post.date} · Founder, Sliding.io</div>
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="prose-custom">
          {renderContent(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-14 p-8 bg-purple-50 rounded-2xl border border-purple-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Try Sliding.io free</h3>
          <p className="text-gray-500 text-sm mb-5">
            Turn your lecture notes into structured slides with speaker notes in 30 seconds.
          </p>
          <Link
            to="/create"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Create your first deck →
          </Link>
        </div>

        {/* Prev / Next */}
        <nav className="mt-12 grid grid-cols-2 gap-4">
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug}`} className="group p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <ArrowLeft className="h-3 w-3" /> Previous
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 line-clamp-2 transition-colors">
                {prevPost.title}
              </p>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`} className="group p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all text-right">
              <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mb-1">
                Next <ArrowRight className="h-3 w-3" />
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 line-clamp-2 transition-colors">
                {nextPost.title}
              </p>
            </Link>
          ) : <div />}
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
