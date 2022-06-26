import { useEffect, useState, useRef } from 'react'

export const useIntersectionObserver = (root = null, threshold = 0, rootMargin = '0%') => {

	const [observerEntry, updateObserverEntry] = useState({})
	const [domNode, setDomNode] = useState(null)
	const observer = useRef(null)

	useEffect(() => {
		if(observer.current)
			observer.current.disconnect()

		observer.current = new window.IntersectionObserver(
			([entry]) => {
				updateObserverEntry(entry)
			},
			{
				root,
				rootMargin,
				threshold,
			}
		)

		const { current: currentObserver } = observer

		if(domNode)
			currentObserver.observe(domNode);

		return () => currentObserver.disconnect();
	}, [domNode, threshold, root, rootMargin]);

	return [setDomNode, observerEntry];
}
