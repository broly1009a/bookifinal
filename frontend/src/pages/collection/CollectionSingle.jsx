import React, { useState, useEffect } from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getCollectionsById, updateCollection } from '../../service/CollectionService';
import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
const CollectionSingle = () => {
    const [data, setData] = useState({})
    const { id } = useParams()
    const [errors, setErrors] = useState([])

    const handleCancel = () => {
        window.location.replace("/collections")
    }

    const handleSave = () => {
        const validationErrors = [];

        // Validate required fields
        if (!data.name || data.name.trim() === '') {
            validationErrors.push('Tên bộ sưu tập không được để trống');
        }
        if (!data.type || data.type.trim() === '') {
            validationErrors.push('Loại bộ sưu tập không được để trống');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors([]);

        data.isDisplay = Boolean(data.isDisplay == 'true');
        updateCollection(data).then(res => {
            if (res.status === 200) {
                window.location.replace("/collections")
            }
            else {
                setErrors(['Có lỗi xảy ra khi cập nhật bộ sưu tập. Vui lòng thử lại.']);
            }
        }).catch(err => {
            setErrors(['Có lỗi xảy ra khi cập nhật bộ sưu tập. Vui lòng thử lại.']);
        })
    }

    useEffect(() => {
        getCollectionsById(id).then((res) => {
            setData(res.data)
        })
    }, [])

    return (
        <div>
            <div className="single">
                <Sidebar />
                {data.length !== 0 && <div className="singleContainer">
                    <Navbar />
                    <div className="wrapper">
                        <div className="function spacing">
                            <h3>Update Collection</h3>
                            <div className="btn-list">
                                {errors.length > 0 && (
                                    <div style={{ color: 'red', marginRight: '20px' }}>
                                        {errors.map((error, index) => (
                                            <div key={index}>{error}</div>
                                        ))}
                                    </div>
                                )}
                                <button onClick={handleCancel} className="cancel">Cancel</button>
                                <button onClick={handleSave} className="save">Save</button>
                            </div>
                        </div>

                        <Grid container spacing={2} className='spacing'>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="name"
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="type"
                                    name="type"
                                    label="Name"
                                    fullWidth
                                    autoComplete="off"
                                    value={data.type}
                                    onChange={(e) => setData({ ...data, type: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                        Display
                                    </InputLabel>
                                    <NativeSelect
                                        value={data.isDisplay}
                                        onChange= {(e) => setData({...data, isDisplay: e.target.value})}
                                        name="display"
                                    >
                                        <option value={true}>True</option>
                                        <option value={false}>False</option>
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default CollectionSingle