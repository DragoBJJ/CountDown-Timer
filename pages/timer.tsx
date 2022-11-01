import React, {useState, useRef} from 'react';

const Clock =() => {
    const [inputTime, setInputTime] = useState<{minutes:number,seconds: number}>({
        minutes: 0,
        seconds: 0
    });
    const intervalRef = useRef<any>(null)
    const timeRef = useRef<number | null>(null);
    const pauseRef = useRef<boolean>(false)

    const [timer, setTimer] = useState<string>('00:00');

    const handleDataTime = (e : React.ChangeEvent<HTMLInputElement>) => {
        setInputTime((prevState)=> ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    function padTo2Digits(num : number) {
        return num.toString().padStart(2, '0');
    }

    const startTimer = (timeRef: number | null) => {
        if(!timeRef) {
            setTimer("Your time has been End !")
            return resetInterval()
        }
        const minutes =  Math.floor(timeRef / 60)
        const seconds  = timeRef % 60
        const result =  `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
        setTimer(result)
    }

    const decrementalTime = () => {
        if(pauseRef.current) return null
        const {minutes,seconds} = inputTime
        if (minutes > 0 || seconds > 0) {
            const minutesInSecond = Number(minutes) * 60
            const minutesAndSecond =  minutesInSecond + Number(seconds)
            let timeInSeconds =  timeRef.current ? timeRef.current : minutesAndSecond
            timeRef.current = timeInSeconds
        }

        if(timeRef.current) {
            --timeRef.current
            startTimer(timeRef.current)
        }

    }

    const startInterval = () => {
        console.log("intervalRef.current",intervalRef.current)
        if(intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(decrementalTime, 1000);
    }

    const pauseInterval = () => {
        console.log("timeRef.current",timeRef.current)
        if(!timeRef.current) return
        pauseRef.current = !pauseRef.current
    }

    const resetInterval = () => {
        if(!intervalRef.current) return
        if(timeRef.current) setTimer("00:00")

        setInputTime((prevState) => ({
            ["minutes"]: 0,
            ["seconds"]: 0
        }))
        timeRef.current = null
        clearInterval(intervalRef.current)
    }


    return (
        <div className="flex flex-col w-full h-full" >
            <div className="flex flex-col w-1/4 items-center justify-center">
                <label className="flex border-2 border-blue-500">
                    <input
                        type="number"
                        value={inputTime.minutes}
                        name="minutes"
                        onChange={(e) => handleDataTime(e)}
                    />
                    Minutes
                </label>
                <label className="flex border-2 border-blue-500">
                    <input
                        type="number"
                        value={inputTime.seconds}
                        name="seconds"
                        onChange={(e) => handleDataTime(e)}
                    />
                    Seconds
                </label>

                <button onClick={startInterval}>START</button>
                <button onClick={pauseInterval}>
                    PAUSE / RESUME
                </button>
                <button onClick={resetInterval}>RESET</button>
            </div>
            <div className="flex w-full">
                <h1 data-testid="running-clock">
                    {timer && timer}
                </h1>
            </div>
        </div>
    );
}

export default Clock;