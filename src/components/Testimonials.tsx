
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Sliding.io has completely transformed how I create presentations. What used to take me hours now takes minutes.",
      author: "Sarah Johnson",
      role: "Marketing Consultant",
    },
    {
      quote: "As an educator, I need to create slide decks frequently. Sliding.io has been a game-changer for my workflow.",
      author: "Dr. Michael Chen",
      role: "University Professor",
    },
    {
      quote: "The quality of the slides Sliding.io produces is remarkable. My clients are always impressed with my presentations.",
      author: "Alex Rivera",
      role: "Business Strategist",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who are saving time and creating better presentations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <svg className="h-8 w-8 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-gray-600 mb-4">{testimonial.quote}</p>
              <p className="font-medium text-gray-900">{testimonial.author}</p>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
