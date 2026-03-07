import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import { getBookById, updateBook } from "../../service/BookService";
import { getAllPublishers } from "../../service/PublisherService";
import { getAllCollections } from "../../service/CollectionService"
import { useNavigate, useParams } from "react-router-dom";
import { getAllAuthors } from "../../service/AuthorService";
import { getAllLanguages } from "../../service/LanguageService";
import { getCategories } from "../../services/CategoryService";

const AdminProductSingle = () => {
    const [data, setData] = useState({})
    const [publishers, setPublishers] = useState([])
    const [collections, setCollections] = useState([])
    const [authors, setAuthors] = useState([])
    const [languages, setLanguages] = useState([])
    const [categories, setCategories] = useState([])
    const { productId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getBookById(productId).then(res => {
            setData(res.data)
        }).catch(err => {
            console.log(err)
        })

        getAllPublishers().then(res => {
            setPublishers(res.data)
        }).catch(err => {
            console.log(err)
        })

        getAllCollections().then(res => {
            setCollections(res.data)
        }).catch(err => {
            console.log(err)
        })

        getAllAuthors().then(res => {
            setAuthors(res.data)
        }).catch(err => {
            console.log(err)
        })

        getAllLanguages().then(res => {
            setLanguages(res.data)
        }).catch(err => {
            console.log(err)
        })

        getCategories().then(res => {
            setCategories(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [productId])

    const handleApprove = () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn duyệt sản phẩm này?");
        if (!confirm) return;

        const updatedBookData = {
            ...data,
            price: parseInt(data.price),
            page: parseInt(data.page),
            stock: parseInt(data.stock),
            weight: parseInt(data.weight),
            discount: parseFloat(data.discount),
            state: "ACTIVE"
        };

        updateBook(productId, updatedBookData).then(res => {
            alert("Đã duyệt thành công!");
            navigate('/admin/products');
        }).catch(err => {
            console.error(err);
            alert("Có lỗi xảy ra khi duyệt!");
        });
    }

    const handleReject = () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn từ chối sản phẩm này?");
        if (!confirm) return;

        const updatedBookData = {
            ...data,
            price: parseInt(data.price),
            page: parseInt(data.page),
            stock: parseInt(data.stock),
            weight: parseInt(data.weight),
            discount: parseFloat(data.discount),
            state: "INACTIVE"
        };

        updateBook(productId, updatedBookData).then(res => {
            alert("Đã từ chối!");
            navigate('/admin/products');
        }).catch(err => {
            console.error(err);
            alert("Có lỗi xảy ra khi từ chối!");
        });
    }

    const handleCancel = () => {
        navigate('/admin/products')
    }

    const shouldShowButtons = data?.state !== "ACTIVE" && data?.state !== "INACTIVE";

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="wrapper">
                    <div className="function spacing">
                        <h3>Chi tiết sản phẩm</h3>
                        <div className="btn-list">
                            <button onClick={handleCancel} className="cancel">Quay lại</button>
                            {shouldShowButtons && (
                                <>
                                    <button onClick={handleReject} className="delete" style={{ marginLeft: '10px' }}>
                                        Từ chối
                                    </button>
                                    <button onClick={handleApprove} className="save" style={{ marginLeft: '10px' }}>
                                        Duyệt
                                    </button>
                                </>
                            )}
                            {data?.state === "ACTIVE" && (
                                <span style={{ color: '#28a745', marginLeft: '20px', fontWeight: 'bold' }}>
                                    Đã duyệt
                                </span>
                            )}
                            {data?.state === "INACTIVE" && (
                                <span style={{ color: '#dc3545', marginLeft: '20px', fontWeight: 'bold' }}>
                                    Đã từ chối
                                </span>
                            )}
                        </div>
                    </div>

                    <Grid container spacing={2} className='spacing'>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="title"
                                name="title"
                                label="Tên sách"
                                fullWidth
                                value={data.title || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="isbn"
                                name="isbn"
                                label="ISBN"
                                fullWidth
                                value={data.isbn || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="description"
                                name="description"
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={4}
                                value={data.description || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="publisher"
                                name="publisher"
                                label="Nhà xuất bản"
                                fullWidth
                                value={data?.publisher?.name || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="language"
                                name="language"
                                label="Ngôn ngữ"
                                fullWidth
                                value={data?.language?.name || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="category"
                                name="category"
                                label="Danh mục"
                                fullWidth
                                value={data?.category?.name || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="authors"
                                name="authors"
                                label="Tác giả"
                                fullWidth
                                value={data?.authors?.map(a => a.name).join(', ') || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="collections"
                                name="collections"
                                label="Bộ sưu tập"
                                fullWidth
                                value={data?.collections?.map(c => c.name).join(', ') || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="price"
                                name="price"
                                label="Giá"
                                type="number"
                                fullWidth
                                value={data.price || 0}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="discount"
                                name="discount"
                                label="Giảm giá (%)"
                                type="number"
                                fullWidth
                                value={data.discount || 0}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="stock"
                                name="stock"
                                label="Số lượng"
                                type="number"
                                fullWidth
                                value={data.stock || 0}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="page"
                                name="page"
                                label="Số trang"
                                type="number"
                                fullWidth
                                value={data.page || 0}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="weight"
                                name="weight"
                                label="Trọng lượng (g)"
                                type="number"
                                fullWidth
                                value={data.weight || 0}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="size"
                                name="size"
                                label="Kích thước"
                                fullWidth
                                value={data.size || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cover"
                                name="cover"
                                label="Loại bìa"
                                fullWidth
                                value={data.cover || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="state"
                                name="state"
                                label="Trạng thái"
                                fullWidth
                                value={data.state === 'ACTIVE' ? 'Đã duyệt' : 'Chờ duyệt'}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        {data.images && data.images.length > 0 && (
                            <Grid item xs={12}>
                                <div>
                                    <InputLabel>Hình ảnh</InputLabel>
                                    <img 
                                        src={data.images[0].link} 
                                        alt={data.title}
                                        style={{ maxWidth: '300px', marginTop: '10px' }}
                                    />
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default AdminProductSingle;
