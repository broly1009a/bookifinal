import React, { useEffect, useState } from 'react'
import Breadscrumb from '../Breadscrumb'
import { Container, Grid } from '@mui/material'
import { getAllPostCategories } from '../../services/PostService';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/PostService';

const formatDate = (inputDate) => {
    if (!inputDate) return '--/--/----';
    var date = new Date(inputDate);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();


    return day + '/' + month + '/' + year;
}

const PostDetail = () => {
    const [categories, setCategories] = React.useState([])
    const { id } = useParams()
    const [post, setPost] = useState({})

    useEffect(() => {
        getAllPostCategories()
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                console.error("Error fetching categories data: ", error)
            })
        id && getPostById(id)
            .then(response => {
                setPost(response.data)
            })
            .catch(error => {
                console.error("Error fetching post data: ", error)
            })
    }, [id])

    return (
        <div>
            <Breadscrumb label={'Bài viết'} />
            <div id="PageContainer" style={{ marginTop: '3%' }}>
                <main className="main-content">
                    <section id="blog-wrapper">
                        <Container maxWidth='lg'>
                            <Grid container spacing={3}>
                                <Grid item md={3}>
                                    <div className="blog-sidebar">
                                        <div className="list-categories">
                                            <div className="blog-sb-title">
                                                <h4>Danh mục tin tức</h4>
                                            </div>
                                            <ul className="no-bullet" style={{ marginTop: '58px' }}>
                                                {
                                                    categories.length !== 0 && categories?.map(category => (
                                                        <li key={category.id} className={post?.category?.id === category.id ? 'active' : ''}>
                                                            <a href={`/blogs/${category.id}`} >{category.name}</a>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item md={9}>
                                    <article>
                                        <div className="article-content">
                                            <div className="article-head">
                                                <h5>{post?.title || 'Bài viết chưa có tiêu đề'}</h5>
                                                <div className="article-date-author">
                                                    <div className='post-info'>
                                                        <div className="post-date me-3">
                                                            <i className="fa fa-calendar me-1" aria-hidden="true"></i>
                                                            <span>{formatDate(post?.createdAt)}</span>
                                                        </div>
                                                        <div className="post-author">
                                                            <i className="fa-solid fa-user me-1"></i>
                                                            <span>{post?.user?.fullName || 'Ẩn danh'}</span>
                                                        </div>
                                                        <div className="post-author" style={{ marginLeft: '12px' }}>
                                                            <i className="fa-solid fa-folder-open me-1"></i>
                                                            <span>{post?.category?.name || 'Chưa phân loại'}</span>
                                                        </div>
                                                        <div className="post-author" style={{ marginLeft: '12px' }}>
                                                            <i className="fa-solid fa-circle-info me-1"></i>
                                                            <span>{post?.state || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {post?.thumbnail && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <img
                                                        src={post.thumbnail}
                                                        alt={post?.title || 'thumbnail'}
                                                        style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px', background: '#f5f5f5' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="article-tldr">
                                                <strong>Tóm tắt:</strong> {post?.brief || 'Chưa có tóm tắt'}
                                            </div>
                                            <div className="article-body" dangerouslySetInnerHTML={{ __html: post?.content || '<p>Chưa có nội dung</p>' }}></div>
                                        </div>
                                    </article>
                                </Grid>
                            </Grid>
                        </Container>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default PostDetail