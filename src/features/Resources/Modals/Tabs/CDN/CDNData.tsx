import React from "react";
import { useLocation } from "react-router-dom";

export default function CDNData({ data }) {
    const location = useLocation();
    console.log(location)

    return (
        <div>
            {data.map((item, index) => {
                return (
                    <div key={index}>
                        <h2>{item.name}</h2>
                        {typeof item.hash == "string"
                            ? (
                                <CDNLink hash={item.hash} />
                            ) : Object.keys(item.hash).map((key, index) => {
                                return (
                                    <>
                                        <h3>{key}:</h3>
                                        <CDNLink hash={item.hash[key]} />
                                    </>
                                )
                            })
                        }
                    </div>
                );
            })}
        </div>
    );
}


const CDNLink = ({hash}) => {

    const getCDNurl = (hash) => {
        return `${window.location.origin}/cdn/${hash}`
    }
    return (
        <a
            href={getCDNurl(hash)}
            target="_blank"
            rel="noreferrer"
        >{getCDNurl(hash)}</a>
    )
}
