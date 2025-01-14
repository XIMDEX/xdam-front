import React, { useEffect, useState } from 'react';

export default function LLM({ data , type}) {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (type === 'resume') {
            fetch(`http://localhost:8084/ximdex/shared/cognitrek/backend/public/api/v1/resource/${data}/summary`)
                .then(response => response.json())
                .then(data => {
                    setValue(data.summary)
                })
        }
        if (type === 'conceptual_map') {
            fetch(`http://localhost:8084/ximdex/shared/cognitrek/backend/public/api/v1/resource/${data}/conceptual_map`)
                .then(response => response.json())
                .then(data => {
                    setValue(data.conceptual_map)
                })
        }
    }, [data, type])

    if (type === 'content') {
        return <iframe src={`http://localhost:8084/ximdex/shared/cognitrek/backend/public/api/v1/viewer/${data}`} title="content" width="100%" height="100%" style={{border: 'none'}}></iframe>
    }
    if (type === 'resume') {
        return (
            <div>{value}</div>
        )
    }
    if (type === 'conceptual_map') {
        return (
            <div>
                {value.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
        )
    }

    return <div>error</div>
}
