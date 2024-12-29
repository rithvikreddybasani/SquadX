import { ColorSwatch, Group } from '@mantine/core';
import { Button } from './buttonsss.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from './randomFile.js';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface ResponseData {
    expr: string;
    result: string;
    assign: boolean;
}

export default function Testing() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [showButtons, setShowButtons] = useState(true);

    const renderLatexToCanvas = useCallback((expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression((prev) => [...prev, latex]);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Delay the LaTeX rendering to ensure MathJax is ready
        setTimeout(() => {
            if (window.MathJax) {
                window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
            }
        }, 100);
    }, []);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result, renderLatexToCanvas]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;

                // Set background color to black when the component mounts
                canvas.style.background = 'black';
            }
        }

        // Dynamically load the MathJax script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const { offsetX, offsetY } = e.type === 'touchstart'
                    ? {
                          offsetX:
                              (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - canvas.getBoundingClientRect().left,
                          offsetY:
                              (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - canvas.getBoundingClientRect().top,
                      }
                    : e.nativeEvent;

                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const { offsetX, offsetY } = e.type === 'touchmove'
                    ? {
                          offsetX:
                              (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - canvas.getBoundingClientRect().left,
                          offsetY:
                              (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - canvas.getBoundingClientRect().top,
                      }
                    : e.nativeEvent;

                ctx.strokeStyle = color;
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const response = await axios.post('https://ai-powered-calculator-1.onrender.com/calculate', {
                image: canvas.toDataURL('image/png'),
                dict_of_vars: dictOfVars,
            });

            const resp: { data: ResponseData[] } = response.data;
            console.log('Response', resp);
            resp.data.forEach((data) => {
                if (data.assign === true) {
                    setDictOfVars((prev) => ({
                        ...prev,
                        [data.expr]: data.result,
                    }));
                }
            });

            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width,
                minY = canvas.height,
                maxX = 0,
                maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {
                        // If pixel is not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPosition({ x: centerX, y: centerY });
            resp.data.forEach((data) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result,
                    });
                }, 1000);
            });
        }
    };

    return (
        <>
            <div className="absolute z-20 top-4 left-0 right-0 flex justify-center items-center space-x-6 px-4">
                <Button
                    onClick={() => setReset(true)}
                    className="w-32 text-black border border-gray-400 text-lg font-bold py-2 px-4 rounded-lg shadow-md hover:text-gray-700 transition duration-300 transform hover:scale-105"
                    variant="default"
                >
                    Reset
                </Button>
                <Group>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch
                            key={swatch}
                            color={swatch}
                            onClick={() => setColor(swatch)}
                            className="cursor-pointer hover:scale-110 transition duration-300"
                        />
                    ))}
                </Group>
                <Button
                    onClick={runRoute}
                    className="w-32 text-black border border-gray-400 text-lg font-bold py-2 px-4 rounded-lg shadow-md hover:text-gray-700 transition duration-300 transform hover:scale-105"
                    variant="default"
                >
                    Run
                </Button>
            </div>
            
            <canvas
                ref={canvasRef}
                id="canvas"
                className="absolute top-0 left-0 w-full h-full z-10"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
            />
            
            {latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                >
                    <div className="absolute z-20 p-2 text-white rounded shadow-md">
                        <div className="latex-content" dangerouslySetInnerHTML={{ __html: latex }} />
                    </div>
                </Draggable>
            ))}
        </>
    );
}
