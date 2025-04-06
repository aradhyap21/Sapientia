
import { Blog, User } from "@/types";

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    isPremium: true,
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

// Mock blog data
export const blogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    content: `
      <p>React Hooks are a powerful feature introduced in React 16.8. They let you use state and other React features without writing a class. In this blog post, we'll explore the most commonly used hooks and how they can simplify your code.</p>
      
      <h2>useState</h2>
      <p>The useState hook lets you add React state to function components. Here's a simple counter example:</p>
      
      <pre><code>
      function Counter() {
        const [count, setCount] = useState(0);
        
        return (
          <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
              Click me
            </button>
          </div>
        );
      }
      </code></pre>
      
      <h2>useEffect</h2>
      <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.</p>
      
      <p>By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed, and call it later after performing the DOM updates.</p>
    `,
    excerpt: "React Hooks are a powerful feature introduced in React 16.8. They let you use state and other React features without writing a class.",
    author: users[0],
    publishedAt: "2025-04-02",
    readTime: "5 min read",
    likes: 42,
    comments: [
      {
        id: "c1",
        content: "Great introduction to hooks! Looking forward to more content like this.",
        user: users[1],
        createdAt: "2025-04-03",
        reactions: [
          { emoji: "👍", count: 5, userReacted: true },
          { emoji: "🎉", count: 2 },
          { emoji: "❤️", count: 3 },
        ],
      },
    ],
    saved: true,
  },
  {
    id: "2",
    title: "The Power of TypeScript in Modern Web Development",
    content: `
      <p>TypeScript has revolutionized how we write and maintain JavaScript code. In this article, we'll explore why TypeScript has become so popular and how it can help you build more robust applications.</p>
      
      <h2>Type Safety</h2>
      <p>One of the biggest advantages of TypeScript is its static type-checking. By defining types for your variables, functions, and objects, you can catch errors at compile time rather than runtime.</p>
      
      <pre><code>
      function add(a: number, b: number): number {
        return a + b;
      }
      
      // This will show an error during development
      add("5", 10); 
      </code></pre>
      
      <h2>Better IDE Support</h2>
      <p>TypeScript provides excellent IntelliSense in modern IDEs like VS Code. This means you get better autocomplete suggestions, inline documentation, and refactoring tools.</p>
      
      <p>The combination of these features leads to a more productive development experience and fewer bugs in production.</p>
    `,
    excerpt: "TypeScript has revolutionized how we write and maintain JavaScript code. Discover why it's become essential for modern web development.",
    author: users[1],
    publishedAt: "2025-04-01",
    readTime: "7 min read",
    likes: 38,
    comments: [
      {
        id: "c2",
        content: "I've started using TypeScript recently and can't imagine going back to plain JS!",
        user: users[2],
        createdAt: "2025-04-01",
        reactions: [
          { emoji: "👍", count: 8 },
          { emoji: "🎉", count: 1 },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Building a Blog with Next.js and Tailwind CSS",
    content: `
      <p>Next.js and Tailwind CSS form a powerful combination for building modern web applications. In this guide, we'll walk through creating a blog from scratch using these technologies.</p>
      
      <h2>Setting Up Your Project</h2>
      <p>Let's start by creating a new Next.js project with Tailwind CSS integration:</p>
      
      <pre><code>
      npx create-next-app my-blog --example with-tailwindcss
      cd my-blog
      </code></pre>
      
      <h2>Creating Blog Posts</h2>
      <p>Next.js makes it easy to create dynamic routes for blog posts. We can use the file system routing to automatically generate pages for each post.</p>
      
      <p>Tailwind CSS allows us to style our components without writing any custom CSS, making the development process much faster.</p>
    `,
    excerpt: "Learn how to build a modern blog using Next.js and Tailwind CSS with this step-by-step guide.",
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: users[2],
    publishedAt: "2025-03-29",
    readTime: "10 min read",
    likes: 56,
    comments: [
      {
        id: "c3",
        content: "This is exactly what I needed! Can you also cover adding a CMS to this setup?",
        user: users[0],
        createdAt: "2025-03-30",
        reactions: [
          { emoji: "👍", count: 3 },
          { emoji: "🙏", count: 5 },
        ],
      },
    ],
    saved: true,
  },
];
