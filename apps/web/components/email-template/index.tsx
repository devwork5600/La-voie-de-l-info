import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "react-email";

interface EmailTemplateProps {
  username: string;
  linkUrl: string;
  text: string;
  buttonText: string;
}

export const EmailTemplate = ({
  username,
  linkUrl,
  text,
  buttonText,
}: EmailTemplateProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html lang="fr">
      <Head />
      <Preview>Connexion à La Voie de l&apos;Info</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/vercel.svg`}
                width="40"
                height="40"
                alt="Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Bienvenue, <strong>{username}</strong>!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Bonjour {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              {text}
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={linkUrl}
              >
                {buttonText}
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              ou copiez et collez cette URL dans votre navigateur :{" "}
              <Link href={linkUrl} className="text-blue-600 no-underline">
                {linkUrl}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Ce lien expirera dans 1 heure. Si vous n&apos;avez pas demandé cet
              e-mail, vous pouvez l&apos;ignorer en toute sécurité.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const Hr = ({ className }: { className?: string }) => (
  <hr className={className} />
);
