import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import {
  fetchPosts,
  selectAllPosts,
  selectPostById,
  selectPostIds,
} from './postsSlice'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { Spinner } from '../../components/Spinner'
import { useGetPostsQuery } from '../api/apiSlice'
import classNames from 'classnames'

let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt">
      <h3>{post?.title}</h3>
      <div>
        <PostAuthor userId={post?.user} />
        <TimeAgo timestamp={post?.date} />
      </div>
      <p className="post-content">{post?.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post?.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

// Using a react memo will ensure a post excerpt component will only render
// when the props actually change. By default the children of a parent all re-render
// when a parent does. Simply clicking a reaction would then re-render every post.
// PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  const {
    data: posts,
    isError,
    isSuccess,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts?.slice()
    // Sort posts in descending chronological order
    sortedPosts?.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classNames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
