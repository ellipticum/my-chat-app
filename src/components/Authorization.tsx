import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Authorization: React.FC = () => {
    const navigate = useNavigate()
    const [idInstance, setIdInstance] = useState('')
    const [apiTokenInstance, setApiTokenInstance] = useState('')

    useEffect(() => {
        const storedId = localStorage.getItem('idInstance')
        const storedToken = localStorage.getItem('apiTokenInstance')
        if (storedId && storedToken) {
            setIdInstance(storedId)
            setApiTokenInstance(storedToken)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!idInstance.trim() || !apiTokenInstance.trim()) {
            alert('Заполните все поля')
            return
        }
        localStorage.setItem('idInstance', idInstance)
        localStorage.setItem('apiTokenInstance', apiTokenInstance)
        navigate('/chat-selection')
    }

    return (
        <div className='login-container'>
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>idInstance</label>
                    <input
                        type='text'
                        value={idInstance}
                        onChange={(e) => setIdInstance(e.target.value)}
                        placeholder='Введите idInstance'
                    />
                </div>
                <div className='form-group'>
                    <label>apiTokenInstance</label>
                    <input
                        type='text'
                        value={apiTokenInstance}
                        onChange={(e) => setApiTokenInstance(e.target.value)}
                        placeholder='Введите apiTokenInstance'
                    />
                </div>
                <div className='navigation-buttons'>
                    <button type='submit'>Вперед</button>
                </div>
            </form>
        </div>
    )
}

export default Authorization
