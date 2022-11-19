import { useState, useEffect, useRef } from 'react'
import Card from './Card'

export default function Deck() {

	const [deck, setDeck] = useState([{}])
	const [inFaroCount, setInFaroCount] = useState(0)
	const [outFaroCount, setOutFaroCount] = useState(0)
	const [shuffleHistory, setShuffleHistory] = useState([])
	const [isShuffling, setIsShuffling] = useState(false)

	useEffect(() => {
		handleCreateDeckInOrderOfSuit()
	}, [])

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
			const randomNumber = getRandomNumber(0,i)
			const temp = arr[i]
			arr[i] = arr[randomNumber]
			arr[randomNumber] = temp
		}
		setDeck(arr.map(card=>card))
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
				arr.push({ suit: suit, number: num})
			})
		})
		setDeck(arr)
		
	}

	// const setRef = () => {
	// 	for (let i = 0; i < deck.length; i++) {
	// 		cardsRef[i]
	// 	}
	// }

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
	}


	const handleInFaroShuffle = () => {
		inFaroShuffle()
		setInFaroCount(inFaroCount+1)
		setOutFaroCount(0)
		setShuffleHistory(current=>{
			return [...current, 'in faro ']
		})
		setIsShuffling(true)
	}
	
	const handleOuyFaroShuffle = () => {
		outFaroShuffle()
		setOutFaroCount(outFaroCount+1)
		setInFaroCount(0)
		setShuffleHistory(current=>{
			return [...current, 'out faro ']
		})
		setIsShuffling(true)
	}


	return (
		<>
			<div>
				<div>
					{shuffleHistory.map(history=>{
						return(
							<div>
								{history}
								<br/>	
							</div>
						)	
					})}
					{/* {shuffleHistory.length > 5 ? shuffleHistory.slice(shuffleHistory.length-5, shuffleHistory.length) : shuffleHistory} */}

				</div>
				<div>
				<button onClick={handleInFaroShuffle} >
					In Faro Shuffle
				</button>
					In Faro Shuffle Consecutive Count: {inFaroCount}
				</div>
				<div>
				<button onClick={handleOuyFaroShuffle} >
					Out Faro Shuffle
				</button>
					Out Faro Shuffle Consecutive Count: {outFaroCount}
				</div>
				<button onClick={randomShuffle}>
					Random Computer Shuffle
				</button>
			</div>
			<div>
				<button onClick={handleCreateDeckInOrderOfSuit}>
					Create Deck in Order of Suit
				</button>
				<button onClick={handleCreateDeckInOrderOfValue}>
					Create Deck in Order of Value
				</button>
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
