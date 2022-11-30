import { hover } from '@testing-library/user-event/dist/hover'
import { useState, useEffect, useRef } from 'react'
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

	useEffect(() => {
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
	}, [])

	const timeout = (ms) => new Promise(
		resolve => setTimeout(resolve, ms)
	)

	const deckSuit = ['diamonds', 'clubs', 'hearts', 'spades']
	const deckNumber = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'
		, 'J', 'Q', 'K']


	// Returns a random number inclusive of min and max
	const getRandomNumber = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	// Fisher-Yates shuffle algorithm
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

	const inFaroShuffle = () => {
		const arr = deck.slice(0, deck.length / 2).flatMap((card, index) => {
			return [deck[index + deck.length / 2], card]
		})
		setDeck(arr)
	}
	const outFaroShuffle = () => {
		const arr = deck.slice(0, deck.length / 2).flatMap((card, index) => {
			return [card, deck[index + deck.length / 2]]
		})
		setDeck(arr)
	}
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
	const handleChangeAnimation = () => {
		setAnimationOff(!animationOff)
	}

	const setPosition = () => {
		hoverableDivRef.current.style.left = `${mousePos.x}px`
		hoverableDivRef.current.style.top = `${mousePos.y}px`
	}

	const handleHoverCreateDeckBySuit = (index) => {
		const arr = hoverButton.slice()
		arr[index] = true
		setHoverButton(arr)
		setPosition()
	}
	const handleHoverOffCreateDeckBySuit = (index) => {
		const arr = hoverButton.slice()
		arr[index] = false
		setHoverButton(arr)
	}

	return (
		<>
			<div className={hoverButton.indexOf(true)!= -1 ? 'hover' : 'not-hovered'} ref={hoverableDivRef}>
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
				+ 'where n is the number of times the swapping has occured. This continues until the first index of the array / deck.'}
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
							onMouseOver={()=>handleHoverCreateDeckBySuit(0)}
							onMouseOut={()=>handleHoverOffCreateDeckBySuit(0)}>
							Create Deck in Order of Suit
						</button>
						<button onClick={handleCreateDeckInOrderOfValue}
							onMouseOver={()=>handleHoverCreateDeckBySuit(1)}
							onMouseOut={()=>handleHoverOffCreateDeckBySuit(1)}>
							Create Deck in Order of Value
						</button>
						<button onClick={handleChangeAnimation}>
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
								<div>
									{history}
								</div>
							)
						})}

						Most Recent
					</div>

					<div className='shuffle-button-container'>
						<button onClick={handleInFaroShuffle} 
						onMouseOver={()=>handleHoverCreateDeckBySuit(2)}
						onMouseOut={()=>handleHoverOffCreateDeckBySuit(2)}>
							In Faro Shuffle
						</button>
						<button onClick={handleOutFaroShuffle}
						onMouseOver={()=>handleHoverCreateDeckBySuit(3)}
						onMouseOut={()=>handleHoverOffCreateDeckBySuit(3)}>
							Out Faro Shuffle
						</button>
						<button onClick={randomShuffle}
						onMouseOver={()=>handleHoverCreateDeckBySuit(4)}
						onMouseOut={()=>handleHoverOffCreateDeckBySuit(4)}>
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
							key={card.suit + card.number} />
					)
				})}
			</div>
		</>
	)
}
