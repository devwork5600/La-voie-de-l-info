import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface NewsletterTemplateProps {
  subject: string;
  content: string;
}

export const NewsletterTemplate = ({
  subject,
  content,
}: NewsletterTemplateProps) => {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{subject}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded border border-solid border-[#eaeaea]">
            <Section className="bg-[#0e1b30] px-[20px] py-[24px] text-center">
              <Text
                className="m-0 text-[22px] font-bold text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                La Voie De L&apos;Info
              </Text>
              <Text className="m-0 mt-1 text-[10px] tracking-widest text-[#ffffff99] uppercase">
                Votre fenêtre sur l&apos;actualité
              </Text>
            </Section>

            <Section className="px-[20px]">
              <Heading className="mx-0 my-[30px] border-l-[3px] border-solid border-[#ca3500] p-0 pl-[12px] text-left text-[22px] font-bold text-black">
                {subject}
              </Heading>

              <Section className="text-[16px] leading-[26px] whitespace-pre-wrap text-black">
                {content}
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Section className="pb-[20px] text-center">
                <Text className="text-[12px] leading-[24px] text-[#666666]">
                  Vous recevez cet e-mail car vous êtes inscrit à la newsletter
                  de La Voie De L&apos;Info.
                </Text>
                <Text className="text-[12px] leading-[20px] text-[#666666]">
                  © {new Date().getFullYear()} La Voie De L&apos;Info. Tous
                  droits réservés.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
