import React, { useEffect, useState } from 'react';
import { Table, Select, Input, Alert } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

// Function to fetch paginated data
const fetchPosts = async (skip, limit) => {
  try {
    const response = await axios.get(`https://dummyjson.com/posts?skip=${skip}&limit=${limit}`);
    return response.data.posts;
  } catch (error) {
    throw new Error('Error fetching posts');
  }
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Parse URL query parameters to set initial state
  useEffect(() => {
    const params = queryString.parse(location.search);
    const current = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    const tags = (params.tags && params.tags.split(',')) || [];
    const search = params.search || '';

    setPagination({ current, pageSize });
    setSelectedTags(tags);
    setSearchText(search);
  }, [location.search]);

  // Fetch data based on current pagination and filters
  useEffect(() => {
    const fetchAndSetData = async () => {
      setLoading(true);
      setError(null);

      try {
        const skip = (pagination.current - 1) * pagination.pageSize;
        const posts = await fetchPosts(skip, pagination.pageSize);
        setData(posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, [pagination, selectedTags, searchText]);

  // Handle pagination changes and update the URL
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    navigate({
      pathname: '/',
      search: queryString.stringify({
        page: pagination.current,
        pageSize: pagination.pageSize,
        tags: selectedTags.join(','),
        search: searchText,
      }),
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Body', dataIndex: 'body', key: 'body' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags', render: (tags) => tags.join(', ') },
  ];

  return (
    <div>
      {error && <Alert message={error} type="error" />}
      <Input
        placeholder="Search posts"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          navigate({
            pathname: '/',
            search: queryString.stringify({
              page: pagination.current,
              pageSize: pagination.pageSize,
              tags: selectedTags.join(','),
              search: e.target.value,
            }),
          });
        }}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Select tags"
        value={selectedTags}
        onChange={(tags) => {
          setSelectedTags(tags);
          navigate({
            pathname: '/',
            search: queryString.stringify({
              page: pagination.current,
              pageSize: pagination.pageSize,
              tags: tags.join(','),
              search: searchText,
            }),
          });
        }}
      >
        <Select.Option value="technology">Technology</Select.Option>
        <Select.Option value="health">Health</Select.Option>
        <Select.Option value="science">Science</Select.Option>
        <Select.Option value="finance">Finance</Select.Option>
      </Select>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HomePage;
