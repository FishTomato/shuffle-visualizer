import { useState, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid';
import Card from './Card'

const ANIMATION_TIME = 1600

export default function Deck() {

	const [deck, setDeck] = useState([{}])
	const [inFaroCount, setInFaroCount] = useState(0)
	const [outFaroCount, setOutFaroCount] = useState(0)
	const [shuffleHistory, setShuffleHistory] = useState(['...', '...', '...', '...', '...'])
	const [isShuffling, setIsShuffling] = useState(false)
	const [animationOff, setAnimationOff] = useState(true)

	const [mousePos, setMousePos] = useState({})
	const [hoverButton, setHoverButton] = useState(Array(5).fill(false))

	const hoverableDivRef = useRef()

	useEffect(() => {
		handleCreateDeckInOrderOfSuit()
	}, [])

	const timeout = (ms) => new Promise(
		resolve => setTimeout(resolve, ms)
	)

	const deckSuit = ['diamonds', 'clubs', 'hearts', 'spades']
	const deckNumber = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'
		, 'J', 'Q', 'K']


	// @param min - the minimum value that can be generated from the function
	// @param max - the maximum value that can be generated from the function
	//
	// Returns a random number inclusive of min and max
	const getRandomNumber = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	// Fisher-Yates shuffle algorithm that randomly shuffles the array of cards
	const randomShuffle = () => {
		const arr = deck
		for (let i = deck.length - 1; i > 0; i--) {
			const randomNumber = getRandomNumber(0, i)
			const temp = arr[i]
			arr[i] = arr[randomNumber]
			arr[randomNumber] = temp
		}
		setDeck(arr.map(card => card))

		const historyArr = []
		shuffleHistory.map((history) => {
			historyArr.push(history)
		})
		historyArr.splice(0, 1)
		historyArr.push('random shuffle')
		setShuffleHistory(historyArr)

		setInFaroCount(0)
		setOutFaroCount(0)
	}

	// Handles the in faro shuffle algorithm and returns an updated version of the array of cards
	const inFaroShuffle = () => {
		const arr = deck.slice(0, deck.length / 2).flatMap((card, index) => {
			return [deck[index + deck.length / 2], card]
		})
		setDeck(arr)
	}

	// Handles the out faro shuffle algorithm and returns an updated version of the array of cards
	const outFaroShuffle = () => {
		const arr = deck.slice(0, deck.length / 2).flatMap((card, index) => {
			return [card, deck[index + deck.length / 2]]
		})
		setDeck(arr)
	}

	/// Creates an array of cards in order of their suit then suit and updates the state of the deck
	const handleCreateDeckInOrderOfSuit = () => {
		const arr = []
		deckSuit.map((suit) => {
			deckNumber.map((num) => {
				arr.push({ suit: suit, number: num })
			})
		})
		setDeck(arr)
		setInFaroCount(0)
		setOutFaroCount(0)
	}

	// Updates the state of the deck according to the out faro shuffling algorithm if the conditions
	// are met and visualizes the changes
	const handleCreateDeckInOrderOfValue = () => {
		const arr = []
		deckNumber.map(num => {
			deckSuit.map(suit => {
				{
					arr.push({ suit: suit, number: num })
				}
			})
		})
		setDeck(arr)
		setInFaroCount(0)
		setOutFaroCount(0)
	}


	// Updates the state of the deck according to the in faro shuffling algorithm if the conditions
	// are met and visualizes the changes
	const handleInFaroShuffle = async () => {
		if (isShuffling) {
			return
		}
		else {

			inFaroShuffle()
			setInFaroCount(inFaroCount + 1)
			setOutFaroCount(0)

			const arr = []
			shuffleHistory.map((history) => {
				arr.push(history)
			})

			arr.splice(0, 1)
			arr.push('in faro')
			setShuffleHistory(arr)

			if (!animationOff) {
				setIsShuffling(true)
				await timeout(ANIMATION_TIME)
				setIsShuffling(false)
			}
		}
	}

	// Handles the out faro shuffle algorithm and updates the state of the deck
	const handleOutFaroShuffle = async () => {
		if (isShuffling) {
			return
		}
		else {
			outFaroShuffle()
			setOutFaroCount(outFaroCount + 1)
			setInFaroCount(0)

			const arr = []
			shuffleHistory.map((history) => {
				arr.push(history)
			})

			arr.splice(0, 1)
			arr.push('out faro')
			setShuffleHistory(arr)

			if (!animationOff) {
				setIsShuffling(true)
				await timeout(ANIMATION_TIME)
				setIsShuffling(false)
			}
		}
	}

	// Updates the state of animationOff equal to its opposite boolean value
	const handleChangeAnimation = () => {
		setAnimationOff(!animationOff)
	}

	// Updates the position of the hoverableDivRef following the cursor
	const setPosition = () => {
		hoverableDivRef.current.style.left = `${mousePos.x}px`
		hoverableDivRef.current.style.top = `${mousePos.y}px`
		const handleMouseMove = (event) => {
			setMousePos({ x: event.clientX, y: event.clientY })
		}
		window.addEventListener('mousemove', handleMouseMove)
		return () => {
			window.removeEventListener(
				'mousemove',
				handleMouseMove
			)
		}

	}
	// @param index - index of the array of boolean hoverButton
	//
	// Updates the state of the hoverButton array at the specific index and updates the 
	// position of the div
	const handleHoverCreateDeckBySuit = (index) => {
		const arr = hoverButton.slice()
		arr[index] = true
		setHoverButton(arr)
		setPosition()
	}

	// @param index - index of the array of boolean hoverButton
	//
	// Updates the state of the hoverButton array at the specific index
	const handleHoverOffCreateDeckBySuit = (index) => {
		const arr = hoverButton.slice()
		arr[index] = false
		setHoverButton(arr)
	}

	return (
		<>
			<div className={hoverButton.indexOf(true) != -1 ? 'hover' : 'not-hovered'} ref={hoverableDivRef}>
				{hoverButton[0] && 'Create a new deck that is sorted in order of their suit'}
				{hoverButton[1] && 'Create a new deck that is sorted in order of value'}
				{hoverButton[2] && 'A mathematical algorithm that splits the deck in half, the bottom pile is '
					+ 'inserted in between the top pile, alternating. The top most card of the bottom pile ends up '
					+ 'on the very top of the shuffled deck while the bottom most card of the top pile is ends up on '
					+ 'the very bottom. A deck of 52 cards would require 52 perfect In faro shuffles to return it to '
					+ 'its original position.'}
				{hoverButton[3] && 'A mathematical algorithm that splits the deck in half, the top pile is '
					+ 'inserted in between the bottom pile, alternating. The top most card of the top pile ends up '
					+ 'on the very top of the shuffled deck while the bottom most card of the bottom pile ends up on '
					+ 'the very bottom. A deck of 52 cards would require 8 perfect Out faro shuffles to return it to '
					+ 'its original position.'}
				{hoverButton[4] && 'Completely shuffles the deck using an algorithm known as the Fisher-Yates shuffle algorithm. '
					+ 'This algorithm swaps the position of two indices, one is index is random while the other is the last index - n, '
					+ 'where n is the number of times the swapping has occured. This continues until the first index of the array.'}
			</div>
			<div>
				<header>
					<h2>
						Shuffle Visualizer
					</h2>
				</header>
				<div className='button-layout'>
					<div className='settings-button-container'>
						<button onClick={handleCreateDeckInOrderOfSuit}
							onMouseOver={() => handleHoverCreateDeckBySuit(0)}
							onMouseOut={() => handleHoverOffCreateDeckBySuit(0)}>
							Create Deck in Order of Suit
						</button>
						<button onClick={handleCreateDeckInOrderOfValue}
							onMouseOver={() => handleHoverCreateDeckBySuit(1)}
							onMouseOut={() => handleHoverOffCreateDeckBySuit(1)}>
							Create Deck in Order of Value
						</button>
						<button onClick={handleChangeAnimation}
							className={animationOff ? 'animation-button-enabled' : 'animation-button-disabled'}>
							{(animationOff ? 'Enable' : 'Disable') + ' Animation'}
						</button>
					</div>
					<div className='history'>
						<h3>
							History
						</h3>
						Oldest:

						{shuffleHistory.map(history => {
							return (
								<div key={uuid()}>
									{history}
								</div>
							)
						})}

						Most Recent
					</div>

					<div className='shuffle-button-container'>
						<button onClick={handleInFaroShuffle}
							onMouseOver={() => handleHoverCreateDeckBySuit(2)}
							onMouseOut={() => handleHoverOffCreateDeckBySuit(2)}>
							In Faro Shuffle
						</button>
						<button onClick={handleOutFaroShuffle}
							onMouseOver={() => handleHoverCreateDeckBySuit(3)}
							onMouseOut={() => handleHoverOffCreateDeckBySuit(3)}>
							Out Faro Shuffle
						</button>
						<button onClick={randomShuffle}
							onMouseOver={() => handleHoverCreateDeckBySuit(4)}
							onMouseOut={() => handleHoverOffCreateDeckBySuit(4)}>
							Random Computer Shuffle
						</button>

					</div>

					<div className='counter'>
						Consecutive Count of In Faro Shuffles: {inFaroCount}

						{` | Consecutive Count of Out Faro Shuffles: ${outFaroCount}`}
					</div>
				</div>
			</div>
			<div className={isShuffling ? 'shuffling' : 'deck'}>
				{deck.map((card) => {
					return (
						<Card card={card}
							key={card.suit + card.number}
						/>
					)
				})}
			</div>
		</>
	)
}

// Copyright 2018 kamijin_fanta <kamijin@live.jp>

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// The MIT License (MIT)
// Copyright (c) 2014-2021 the native web.

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.