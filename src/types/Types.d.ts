type MessageType = 'success' | 'error' | 'warning';

type ActionResult = {
    type: MessageType;
    message: string;
    details?: number | string | string[];
};
