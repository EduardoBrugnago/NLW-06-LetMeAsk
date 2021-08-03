import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { useAdmRoom } from '../hooks/useAdmRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import toast from 'react-hot-toast';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();

    const params = useParams<RoomParams>();

    const roomId = params.id;

    const isAuthor = useAdmRoom(roomId);
    const { title, questions } = useRoom(roomId);
    const [newAnswer, setNewAnswer] = useState('');

    async function handleDeleteQuestion(questionId: string) {
        toast.dismiss();

        if(isAuthor === true) {
            toast(
                (t) => (
                    <span>
                        Tem certeza que você deseja excluir esta pergunta?
                        <div style={{display: "flex", gap: "12px", marginTop: "12px"}}>
                            <Button onClick={() => deleteQuestion(questionId, t.id)}>Sim</Button>
                            <Button onClick={() => toast.dismiss(t.id)}>Não</Button>    
                        </div>
                    </span>
                ),
                {
                    duration: Infinity,
                },
              );
         } else {
            toast.error(`don't have permission`);
        } 
    }

    async function handleEndRoom() {
        if(isAuthor === true) {
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date(),
            })
    
            history.push('/');
         } else {
            toast.error(`don't have permission`);
        }
    }

    async function deleteQuestion(questionId: string, t: any) {
        if(isAuthor === true) { 
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
            toast.dismiss(t.id);
        } else {
            toast.error(`don't have permission`);
        }
    }

    async function handleQuestionAnswered(questionId: string, event: string) {
        if(isAuthor === true) { 
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                answer: newAnswer,
                isAnswered: true,
            });
        } else {
            toast.error(`don't have permission`);
        }
    }

    async function handleHighlightQuestion(questionId: string, highlighted: boolean) {
        if(isAuthor === true) { 
            const isHighlighted = !highlighted;
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: isHighlighted,
            });
        } else {
            toast.error(`don't have permission`);
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img onClick={event => history.push('')} src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}></RoomCode>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <div className="question-box"> 
                                <Question 
                                key={question.id}
                                content={question.content}
                                answer={question.answer}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                                > 
                                    {!question.isAnswered && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}>
                                                    <img src={answerImg} alt={'Responder a pergunta'} />
                                            </button>                
                                        </>
                                    )}                                
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}>
                                            <img src={deleteImg} alt={'Remover pergunta'} />
                                    </button>
                                </Question> 

                                {question.isHighlighted && !question.isAnswered && (
                                    <> 
                                        <form className="textAnswer">
                                            <textarea
                                            placeholder="Responda Aqui"
                                            onChange={event => setNewAnswer(event.target.value)}
                                            value={newAnswer}
                                            ></textarea>
                                            <div className="form-footer">
                                                <Button 
                                                type="submit"
                                                onClick={() => handleQuestionAnswered(question.id, newAnswer)}>
                                                    Responder</Button>
                                            </ div>
                                        </form> 
                                    </>
                                )}

                                {question.isAnswered && (
                                    <>
                                        <div className="answer-container">
                                            <p style={{fontWeight: 'bold'}}>Resposta:</p>
                                            <p>{question.answer}</p>
                                        </div>    
                                    </>
                                )}
                            </div>      
                        );
                    })}
                </div>
            </main>
        </div>
    );
}