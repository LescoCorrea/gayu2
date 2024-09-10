import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendContactMessage } from './contactAction';
import './Contact.css'

export default function Contacts() {


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [messageError, setMessageError] = useState('');
    const dispatch = useDispatch();
    const { message, error, loading } = useSelector(state => state.contact);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (e.target.name === 'name') setNameError('');
        if (e.target.name === 'email') setEmailError('');
        if (e.target.name === 'message') setMessageError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        if (!formData.name) {
            setNameError('Le nom est requis.');
            valid = false;
        }
        if (!formData.email) {
            setEmailError('L\'email est requis.');
            valid = false;
        }
        if (!formData.message) {
            setMessageError('Le message est requis.');
            valid = false;
        }

        if (!valid) return;

        dispatch(sendContactMessage(formData));

        setFormData({
            name: '',
            email: '',
            message: ''
        });

        setNameError('');
        setEmailError('');
        setMessageError('');
    };

    return (
        <div>
            <div className="container">
                <h1 className='title-serv'>Contactez - nous</h1>
                <p className='par-serv'>
                    Merci de votre intérêt pour la plateforme Gayu. Complétez le formulaire<br /> ci-dessous et certains vous contacteront sous peu.
                </p>
                <div className='row mt-5'>
                    <div className='col-md-6 mb-5'>
                        <div className="form-container form-containers-ct">
                        
                            <div className={`cnt-message ${message ? 'cnt-message-success' : ''} ${error ? 'cnt-message-error' : ''}`}>
                                {message && <p>{message}</p>}
                                {error && <p>{error}</p>}
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input type="text" className={`form-controls mt-3 ${nameError ? 'form-control-errors' : ''}`} name="name" value={formData.name} onChange={handleChange} placeholder="Nom*" />
                                    {nameError && <p className="error-text">{nameError}</p>}
                                </div>
                                <div>
                                    <input type="text" className={`form-controls mt-3 ${nameError ? 'form-control-errors' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="E-mail*" />
                                    {emailError && <p className="error-text">{emailError}</p>}
                                </div>
                                <div>
                                    <textarea className={`form-controlt mt-3 ${messageError ? 'form-control-errors' : ''}`} name="message" value={formData.message} onChange={handleChange} cols="47.5" rows="7" placeholder='Entrez votre message ici'></textarea>
                                    {messageError && <p className="error-text">{messageError}</p>} 
                                </div>
                                <div className="profile-contact mt-5">
                                    <div >
                                        <button className="btn-r-smt" disabled={loading}>
                                            {loading ? 'Envoi en cours...' : 'SOUMETTRE'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-6 col-bg">
                        <div className='par-contact'>
                            <p className='paragraph-contact'>
                                Lorem ipsum dolor sit amet consectetur. In magna vel convallis in tortor dictumst donec. Non cursus magna et tellus vitae est. Netus venenatis tempor sed in.
                                Sed at ut amet ultricies turpis parturient etiam viverra. Magna sit varius amet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
