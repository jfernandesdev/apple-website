import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const Model = () => {
  useGSAP(() => {
    gsap.to("#heading", {
      opacity: 1,
    })
  })

  return (
    <section id="model-section" className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>
      </div>
    </section>
  )
}

export default Model