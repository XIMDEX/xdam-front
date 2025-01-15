import React, { useEffect, useState } from 'react';
import { COGNITIVE_API_URL } from '../../../../../constants';
import { InteractiveStars, StaticStars } from '../../../../../components/feedback/StarRating';
import VariantSelector from '../../../../../components/variants/VariantSelector';

function parseMarkdownToHTML(md) {
    const lines = md.split('\n');
    let html = '';

    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/); // Detecta encabezados Markdown (#, ##, ###, etc.)
      if (headingMatch) {
        const level = headingMatch[1].length; // Cuenta la cantidad de #
        const content = headingMatch[2]; // Contenido del encabezado
        html += `<h${level}>${content}</h${level}>\n`;
      } else if (line.trim() === '') {
        html += '\n'; // Mantener líneas vacías como separadores
      } else {
        html += `<p>${line}</p>\n`; // Convierte líneas normales en párrafos
      }
    });

    return html;
}


export default function LLM({ data , type}) {
    const [value, setValue] = useState('');
    const [condition, setCondition] = useState([]);
    const [variants, setVariants] = useState([]);

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleRatingChange = (rating) => {
        setRating(rating);
    }

    const handleFeedbackChange = (feedback) => {
        setFeedback(feedback);
    }

    useEffect(() => {
        fetch(`${COGNITIVE_API_URL}/conditions`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    data = data.map(condition => ({
                        id: condition.id,
                        label: condition.type
                    }))
                }
                setCondition(data)
                console.log(data)
            })

        fetch(`${COGNITIVE_API_URL}/resource/${data}/variants`)
            .then(response => response.json())
            .then(data => {
                setVariants([])
            })
    }, [])

    useEffect(() => {
        if (condition.length == 0) {
            return
        }

        if (type === 'resume') {
            fetch(`${COGNITIVE_API_URL}/resource/${data}/summary`)
                .then(response => response.json())
                .then(data => {
                    setValue(data.summary)
                })
        }
        if (type === 'conceptual_map') {
            fetch(`${COGNITIVE_API_URL}/resource/${data}/conceptual_map`)
                .then(response => response.json())
                .then(data => {
                    setValue(data.conceptual_map)
                })
        }
    }, [condition, type])

    if (type === 'content') {
        return (
            <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <VariantSelector conditions={condition} variants={variants} />
                {condition.length > 0 && (
                    <iframe src={`${COGNITIVE_API_URL}/viewer/${data}`} title="content" width="100%" height="100%" style={{border: 'none', flexGrow: 1, paddingBottom: 10}}></iframe>
                )}
                <div id='feedback'>
                    <InteractiveStars rating={rating} onRatingChange={handleRatingChange} onFeedbackChange={handleFeedbackChange} onSubmit={() => {}} feedback={feedback} />
                </div>
            </div>
        )
    }
    if (type === 'resume') {
        return (
            <div>{value}</div>
        )
    }
    if (type === 'conceptual_map') {
        return ( <div dangerouslySetInnerHTML={{__html: parseMarkdownToHTML(value)}} ></div> )
        // return (
        //     <div>
        //         {value.split('\n').map((line, index) => (
        //             <div key={index}>{line}</div>
        //         ))}
        //     </div>
        // )
    }

    return <div>error</div>
}
