import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCategories, deleteCategory, addCategory, selectCategories } from '../Slices/categorySlice';
import { RootState } from '../Store/store';
import { useAppDispatch } from '../Hooks/hooks';  
import { useForm } from 'react-hook-form';
import styles from './CategoryList.module.scss'; 

const CategoryList: React.FC = () => {
    const dispatch = useAppDispatch(); 
    const categories = useSelector(selectCategories);
    const loading = useSelector((state: RootState) => state.category.loading);
    const error = useSelector((state: RootState) => state.category.error);
    const totalPages = useSelector((state: RootState) => state.category.totalPages); // Предположим, что это значение получаете из Redux
    const [page, setPage] = useState(0);

    useEffect(() => { 
        dispatch(fetchCategories({ page, size: 10 })); 
    }, [dispatch, page]);

    const handleDelete = (id: number) => { 
        dispatch(deleteCategory(id)); 
    };

    const { register, handleSubmit, reset } = useForm<{ name: string; description: string; slug: string }>();

    const onSubmit = (data: { name: string; description: string; slug: string }) => {
        dispatch(addCategory(data));
        reset(); 
    };

    return (
        <div className={styles.container}>
            <h1>Categories</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name} - {category.description}
                        <button onClick={() => handleDelete(category.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div className={styles.pagination}>
                <button onClick={() => setPage(page - 1)} disabled={page <= 0}>Previous</button>
                <span>{` Page ${page + 1} of ${totalPages} `}</span> {/* Отображение текущей страницы и общего количества страниц */}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>Next</button>
            </div>
            
            <h2>Add New Category</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name:</label>
                    <input {...register('name', { required: true })} />
                </div>
                <div>
                    <label>Description:</label>
                    <input {...register('description', { required: true })} />
                </div>
                <div>
                    <label>Slug:</label>
                    <input {...register('slug', { required: true })} />
                </div>
                <button type="submit">Add Category</button>
            </form>
        </div>
    );
};

export default CategoryList;