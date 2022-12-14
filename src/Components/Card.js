import React, { useState } from 'react'
import { ImDiamonds, ImClubs, ImHeart, ImSpades } from 'react-icons/im'

export default function Card({
    card,
    isPlayingAnimation
}) {
    const [isSelected, setIsSelected] = useState(false)
    return (
        <div className='card-wrapper'>
            <div
                className={(isSelected ? 'selected ' : '') + card.suit + ' card'
            + (isPlayingAnimation ? 'split' : '')}
                onClick={() => {
                    setIsSelected(!isSelected)
                }}
            >
                {card.number}
                {card.suit === 'diamonds' && <ImDiamonds />}
                {card.suit === 'clubs' && <ImClubs />}
                {card.suit === 'hearts' && <ImHeart />}
                {card.suit === 'spades' && <ImSpades />}
            </div>
        </div>
    )
}
