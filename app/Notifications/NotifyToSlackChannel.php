<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\SlackMessage;

class NotifyToSlackChannel extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['slack'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toSlack($notifiable)
    {
        $stats = $this->data;

        return (new SlackMessage)
            ->content($stats['content'])
            ->attachment(function($attachment) use ($stats){
                $attachment->title("{$stats['title']}")
                    ->fields([
                        "Environment" => $stats['environment'],
                        "Created Deals" => isset($stats['created']) ? $stats['created'] : 0,
                        "Updated Deals" => isset($stats['updated']) ? $stats['updated'] : 0,
                        "Skipped Deals" => isset($stats['skipped']) ? $stats['skipped'] : 0,
                        "No Matching VIN Deals" => isset($stats['novins']) ? $stats['novins'] : 0,
                        "Misc. Deal Errors" => isset($stats['miscerrors']) ? $stats['miscerrors'] : 0,
                        "Total Execution Time" => isset($stats['totaltime']) ? $stats['totaltime'] : 0,
                    ]);
            });

    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
