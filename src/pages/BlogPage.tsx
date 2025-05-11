
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Clock, User } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      title: "5 Ways AI Is Transforming Presentation Creation",
      excerpt: "Discover how artificial intelligence is revolutionizing the way professionals create and deliver presentations in 2025.",
      author: "Lyam Johnson",
      date: "May 5, 2025",
      readTime: "5 min read",
      category: "AI & Productivity"
    },
    {
      title: "From Outline to Presentation: A 10-Minute Guide",
      excerpt: "Learn how to transform your rough notes into a polished presentation in just minutes using smart AI tools.",
      author: "Sarah Chen",
      date: "April 28, 2025",
      readTime: "4 min read",
      category: "Tutorials"
    },
    {
      title: "The Psychology of Effective Slides: Less is More",
      excerpt: "Research shows that simpler slides with focused messaging lead to better audience retention and engagement.",
      author: "Dr. Michael Rivera",
      date: "April 15, 2025",
      readTime: "7 min read",
      category: "Presentation Strategy"
    },
    {
      title: "Behind the Scenes: How We Built Sliding.io",
      excerpt: "A look at our journey from idea to product, and the challenges we faced along the way.",
      author: "Lyam Johnson",
      date: "April 3, 2025",
      readTime: "6 min read",
      category: "Company News"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Sliding.io</span>
            <span className="block text-primary">Blog</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Insights on AI-powered productivity, presentation strategy, and company updates
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 mt-16">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 h-48"></div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-primary mb-2">
                  <span>{post.category}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                  <a href="#post">{post.title}</a>
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="link" className="p-0 h-auto text-primary">Read more →</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg">Load More Articles</Button>
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Get the latest articles, tutorials, and company news delivered straight to your inbox.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
