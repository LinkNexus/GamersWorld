<?php

namespace App\Controller\Game;

use App\Entity\GameSession;
use App\Entity\User;
use App\Service\AutomatedOpponent;
use App\Service\UpdatesBroadcaster;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/games/session', name: 'app_games_session', methods: ['POST'])]
final class SessionController extends AbstractController
{

    public function __construct(
        private readonly UpdatesBroadcaster $broadcaster,
        private readonly EntityManagerInterface $entityManager,
        private readonly AutomatedOpponent $automatedOpponent
    )
    {}

    #[Route('/{identifier}/events', name: '_events')]
    public function publish(
        Request $request,
        string $identifier
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        return $this->broadcaster->broadcast(
            [
                'http://localhost:5001/join/' . $identifier,
                'http://localhost:5001/players/synchronize/' . $identifier,
                'http://localhost:5001/players/is-ready/' . $identifier,
                'http://localhost:5001/players/disconnect/' . $identifier,
                'http://localhost:5001/play/' . $identifier,
            ],
            callback: function () use ($data) {
                if ($data['event'] === 'PLAY' && $data['payload']['againstComputer']) {
                    return json_encode([
                        'event' => 'PLAY',
                        'payload' => $this->automatedOpponent->process($data['payload'])
                    ]);
                }

                return json_encode($data);
            }
        );
    }

    #[Route('/{identifier}/add-opponent', name: '_add-opponent')]
    public function setOpponent(
        #[MapEntity(mapping: ['identifier' => 'identifier'])]
        GameSession $session,
        Request $request,
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $opponent = $this->entityManager->getRepository(User::class)->findOneBy([
            'identifier' => $data['identifier']
        ]);

        if ($data['isReady']) {
            if ($opponent && !$session->getOpponents()->contains($opponent)) {
                $session->addOpponent($opponent);
                $this->entityManager->flush();
            }
        } else {
            $session->removeOpponent($opponent);
            $this->entityManager->flush();
        }

        return $this->json(['status' => 'ok']);
    }

    #[Route('/{identifier}/winner', name: '_winner')]
    public function setWinner(
        #[MapEntity(mapping: ['identifier' => 'identifier'])]
        GameSession $session,
        Request $request,
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data && $data['identifier']) {
            $winner = $this->entityManager->getRepository(User::class)->findOneBy([
                'identifier' => $data['identifier']
            ]);

            if ($winner) {
                $session->setWinner($winner);
            }
        }

        $session->setIsCompleted(true);
        $this->entityManager->flush();

        return $this->json(['status' => 'ok']);
    }
}
