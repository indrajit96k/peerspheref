import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Question } from '../types';
import { ThumbsUp, MessageCircle, Eye, Filter, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/questions?filter=${filter}&tab=${activeTab}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Mock data for development
    const mockQuestions: Question[] = [
      {
        id: '1',
        title: 'How to prepare for technical interviews as a CS student?',
        content: 'I am a junior CS student and want to prepare for internship interviews. What resources should I use?',
        tags: ['career', 'interviews', 'computer-science'],
        author: {
          id: '101',
          email: 'john@example.com',
          username: 'john_doe',
          fullName: 'John Doe',
          role: 'verified',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z'
        },
        upvotes: 24,
        downvotes: 2,
        answerCount: 5,
        views: 120,
        createdAt: '2023-05-10T14:30:00Z',
        updatedAt: '2023-05-10T14:30:00Z'
      },
      {
        id: '2',
        title: 'What electives should I take for a Data Science career?',
        content: 'I\'m majoring in Statistics and want to pursue Data Science. Which electives would be most beneficial?',
        tags: ['data-science', 'academics', 'career-advice'],
        author: {
          id: '102',
          email: 'sarah@example.com',
          username: 'sarah_smith',
          fullName: 'Sarah Smith',
          role: 'user',
          createdAt: '2023-02-20T00:00:00Z',
          updatedAt: '2023-02-20T00:00:00Z'
        },
        upvotes: 18,
        downvotes: 0,
        answerCount: 3,
        views: 95,
        createdAt: '2023-05-12T09:15:00Z',
        updatedAt: '2023-05-12T09:15:00Z'
      },
      {
        id: '3',
        title: 'How to balance part-time work and studies?',
        content: 'I need to work part-time to support my education. How do I balance work and academics effectively?',
        tags: ['work-life-balance', 'academics', 'student-life'],
        author: {
          id: '103',
          email: 'mike@example.com',
          username: 'mike_johnson',
          fullName: 'Mike Johnson',
          role: 'user',
          createdAt: '2023-03-05T00:00:00Z',
          updatedAt: '2023-03-05T00:00:00Z'
        },
        upvotes: 32,
        downvotes: 1,
        answerCount: 8,
        views: 210,
        createdAt: '2023-05-08T16:45:00Z',
        updatedAt: '2023-05-08T16:45:00Z'
      }
    ];

    // Use mock data for now
    setQuestions(mockQuestions);
    setLoading(false);

    // Uncomment to use real API when backend is ready
    // fetchQuestions();
  }, [filter, activeTab]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Questions</h1>
        <Link to="/ask" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Ask a Question
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => handleTabChange('all')}
          >
            All Questions
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => handleTabChange('following')}
          >
            Following
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'unanswered' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => handleTabChange('unanswered')}
          >
            Unanswered
          </button>
        </div>

        <div className="flex justify-end p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="text-sm border-none focus:ring-0 text-gray-700 bg-transparent"
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="votes">Most Votes</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="p-6 hover:bg-gray-50">
                <Link to={`/questions/${question.id}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                    {question.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="mr-1" />
                      <span>{question.upvotes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="mr-1" />
                      <span>{question.answerCount}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      <span>{question.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="flex items-center mr-3">
                      {typeof question.author !== 'string' && question.author.avatar ? (
                        <img
                          src={question.author.avatar}
                          alt={question.author.username}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <span className="text-xs text-blue-600 font-medium">
                            {typeof question.author !== 'string' ? question.author.username.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-700">
                        {typeof question.author !== 'string' ? question.author.username : 'Unknown'}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No questions found. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;