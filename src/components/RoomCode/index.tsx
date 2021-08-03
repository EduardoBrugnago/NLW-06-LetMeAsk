import toast from 'react-hot-toast';
import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        toast.success('Room code copied');
    }
    
    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="copy room code" />
            </div>
            <span>Sala #{props.code}</span>
         </button>
    )
}