import React from 'react';
import { StaticStars } from '../../../../../components/feedback/StarRating';

export default function FeedbackTab({data}) {
    return (
        <div>
            <h3>Adaptation 1</h3>
            <StaticStars rating={4.5} feedbacks={["Buen producto, pero podría mejorar en algunos aspectos.", "Me encanta, lo uso todos los días."]}/>

            <h3>Adaptation 3</h3>
            <StaticStars rating={2.5} feedbacks={["Deja mucho que desear.", "Me ha ayudado con mi dislexia"]}/>
        </div>
    )
}
