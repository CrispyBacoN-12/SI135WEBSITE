import Image from "next/image"

export default function EVBUS()
{
    return(
<div>
       <Image
            src="/EVBUS1"
            alt="EVBUS1"
            fill
            className="object-cover"
            priority
          />
          <Image
            src="/EVBUS2"
            alt="EVBUS2"
            fill
            className="object-cover"
            priority
          />
          <Image
            src="/EVBUS3"
            alt="EVBUS3"
            fill
            className="object-cover"
            priority
          />
</div>
    )
}