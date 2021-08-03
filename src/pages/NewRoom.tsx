import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logout_icon from '../assets/images/logout-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/auth.scss'

export function NewRoom() {
    const { user, signOutFromGoogle } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');
    
    async function signOut () {
        await signOutFromGoogle();
        
        history.push('/');
    }

    async function handleCreateRoom (event: FormEvent) {
        event.preventDefault();
        
        if(newRoom.trim() === '') {
            return;
        }

        if(!user){
            toast.error('User not logged in')
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/admin/rooms/${firebaseRoom.key}`);
    }
    
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" onClick={event => history.push('')}/>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text"
                        placeholder="Nome da sala" 
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />         
                        <div>
                            <Button type="submit">
                                Criar sala
                            </Button>
                            <Button isSignOut onClick={signOut}>
                                <img src={logout_icon} alt="Ícone de LogOut" />
                            </Button>                  
                        </div>
                        <p>
                            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )
}