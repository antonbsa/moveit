import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountodwnProviderProps {
    children: ReactNode;
    fullTime: number;
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdowTimeout: NodeJS.Timeout;

export function CountdownProvider({ children, ...rest }: CountodwnProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);
    const fullTime = rest.fullTime;

    const [time, setTime] = useState(fullTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdowTimeout);
        setIsActive(false);
        setTime(fullTime * 60);
        setHasFinished(false);
    }

    useEffect(() => {
        if(isActive && time > 0) {
            countdowTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if( isActive && time == 0 ) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])
    
    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}