import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatSelection: React.FC = () => {
    const navigate = useNavigate()
    const [phone, setPhone] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const phoneRegex = /^[0-9]{10,15}$/
        if (!phoneRegex.test(phone.trim())) {
            alert('Неверный формат номера телефона. Используйте только цифры (10-15 цифр).')
            return
        }
        localStorage.setItem('phone', phone)
        navigate('/chat')
    }

    return (
        <div className='chat-setup-container'>
            <h2>Введите номер телефона</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Номер телефона (без +, только цифры)</label>
                    <input
                        type='text'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder='Например: 71234567890'
                    />
                </div>
                <div className='navigation-buttons'>
                    <button type='button' onClick={() => navigate('/authorization')}>
                        Назад
                    </button>
                    <button type='submit'>Вперед</button>
                </div>
            </form>
        </div>
    )
}

export default ChatSelection
