"use client"

import React from 'react'
import StarIcon from './StarIcon'

interface StarProps {
  filled: number
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function Star({ filled, onClick, onMouseEnter, onMouseLeave }: StarProps) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: onClick ? 'pointer' : 'default',
        width: '24px',
        height: '24px',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {filled === 0.5 ? (
        <>
            <div
                style={{
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <StarIcon
                    style={{
                        color: '#FFB800',
                        width: '200%',
                        height: '100%',
                    }}
                    isHalf={true}
                    fill="currentColor"
                />
            </div>
            <StarIcon
                style={{
                    color: '#FFB800',
                    width: '100%',
                    height: '100%',
                }}
                isHalf={false}
                fill={'none'}
            />
        </>
      ) : (
        <StarIcon
            style={{
                color: '#FFB800',
                width: '100%',
                height: '100%',
            }}
            isHalf={false}
            fill={filled > 0 ? 'currentColor' : 'none'}
        />
      ) }
    </span>
  )
}

interface InteractiveStarsProps {
  rating: number
  onRatingChange: (rating: number) => void
  onFeedbackChange: (feedback: string) => void
  onSubmit: () => void
  feedback: string
}

export function InteractiveStars({
  rating,
  onRatingChange,
  feedback,
  onFeedbackChange,
  onSubmit
}: InteractiveStarsProps) {
  const [hover, setHover] = React.useState(0)

  return (
    <div style={{ marginBottom: '0px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '0px', marginLeft: '10px' }}>
        <h3 style={{marginRight: 20}}>Rate the Adaptation</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={hover || rating >= star ? 1 : 0}
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
        <span style={{ color: '#666', fontSize: '14px', paddingTop: '2px' }}>
          Rating: {rating} out of 5
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Your feedback..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <button
          onClick={onSubmit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

interface StaticStarsProps {
  rating: number
  feedbacks: string[]
}

export function StaticStars({ rating, feedbacks }: StaticStarsProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={Math.max(0, Math.min(1, rating - star + 1))}
            />
          ))}
        </div>
        <span style={{ color: '#666', fontSize: '14px' }}>
          {rating} out of 5
        </span>
      </div>
      {feedbacks.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Customer Feedback:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#f4f4f4',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                "{feedback}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

