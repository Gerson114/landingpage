import Image from "next/image";
import img from "../../../img/img_logo/7.jpg"

export default function Header() {
    return (
        <header>

            <div className="flex justify-center">
                <div className="max-w-[1140px] w-full  flex justify-between  items-center ">

                    <Image
                        src={img}
                        alt="texto"
                        width={100}         // Largura da imagem
                        height={100}        // Altura da imagem
                    />

                    <div className="flex gap-[50px] ">
                        <p>Home</p>
                        <p>sobre</p>
                        <p>contato</p>
                        <p>blog</p>
                    </div>
                </div>
            </div>
        </header>
    );
}